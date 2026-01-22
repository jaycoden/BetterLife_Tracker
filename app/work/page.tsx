'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { storage } from '@/lib/storage/localStorage';

interface Project {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'paused' | 'completed';
  priority: 1 | 2 | 3;
  createdAt: string;
}

interface Task {
  id: string;
  title: string;
  projectId: string;
  priority: 1 | 2 | 3;
  deadline: string;
  completed: boolean;
  createdAt: string;
}

const PRIORITY_COLORS = {
  1: 'from-red-400 to-red-500',
  2: 'from-yellow-400 to-yellow-500',
  3: 'from-green-400 to-green-500',
};

const PRIORITY_LABELS = {
  1: 'High',
  2: 'Medium',
  3: 'Low',
};

export default function WorkPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    status: 'active' as 'active' | 'paused' | 'completed',
    priority: 2 as 1 | 2 | 3,
  });

  const [taskForm, setTaskForm] = useState({
    title: '',
    projectId: '',
    priority: 2 as 1 | 2 | 3,
    deadline: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const savedProjects = storage.get('lifeos_projects') || [];
    const savedTasks = storage.get('lifeos_tasks') || [];
    setProjects(savedProjects);
    setTasks(savedTasks);
  };

  const saveProjects = (updatedProjects: Project[]) => {
    storage.set('lifeos_projects', updatedProjects);
    setProjects(updatedProjects);
  };

  const saveTasks = (updatedTasks: Task[]) => {
    storage.set('lifeos_tasks', updatedTasks);
    setTasks(updatedTasks);
  };

  const createProject = () => {
    if (!projectForm.title.trim()) return;

    const newProject: Project = {
      id: Date.now().toString(),
      title: projectForm.title.trim(),
      description: projectForm.description.trim(),
      status: projectForm.status,
      priority: projectForm.priority,
      createdAt: new Date().toISOString(),
    };

    saveProjects([...projects, newProject]);
    resetProjectForm();
    setIsCreatingProject(false);
  };

  const updateProject = () => {
    if (!editingProject || !projectForm.title.trim()) return;

    const updatedProjects = projects.map(project =>
      project.id === editingProject.id
        ? {
            ...project,
            title: projectForm.title.trim(),
            description: projectForm.description.trim(),
            status: projectForm.status,
            priority: projectForm.priority,
          }
        : project
    );

    saveProjects(updatedProjects);
    setEditingProject(null);
    resetProjectForm();
  };

  const deleteProject = (id: string) => {
    if (confirm('Are you sure? This will also delete all tasks in this project.')) {
      saveProjects(projects.filter(p => p.id !== id));
      saveTasks(tasks.filter(t => t.projectId !== id));
    }
  };

  const createTask = () => {
    if (!taskForm.title.trim() || !taskForm.projectId) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: taskForm.title.trim(),
      projectId: taskForm.projectId,
      priority: taskForm.priority,
      deadline: taskForm.deadline,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    saveTasks([...tasks, newTask]);
    resetTaskForm();
    setIsCreatingTask(false);
  };

  const updateTask = () => {
    if (!editingTask || !taskForm.title.trim()) return;

    const updatedTasks = tasks.map(task =>
      task.id === editingTask.id
        ? {
            ...task,
            title: taskForm.title.trim(),
            projectId: taskForm.projectId,
            priority: taskForm.priority,
            deadline: taskForm.deadline,
          }
        : task
    );

    saveTasks(updatedTasks);
    setEditingTask(null);
    resetTaskForm();
  };

  const deleteTask = (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      saveTasks(tasks.filter(t => t.id !== id));
    }
  };

  const toggleTaskComplete = (id: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks(updatedTasks);
  };

  const resetProjectForm = () => {
    setProjectForm({
      title: '',
      description: '',
      status: 'active',
      priority: 2,
    });
  };

  const resetTaskForm = () => {
    setTaskForm({
      title: '',
      projectId: projects.length > 0 ? projects[0].id : '',
      priority: 2,
      deadline: '',
    });
  };

  const startEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      status: project.status,
      priority: project.priority,
    });
    setIsCreatingProject(true);
  };

  const startEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      projectId: task.projectId,
      priority: task.priority,
      deadline: task.deadline,
    });
    setIsCreatingTask(true);
  };

  const cancelProjectEdit = () => {
    setEditingProject(null);
    resetProjectForm();
    setIsCreatingProject(false);
  };

  const cancelTaskEdit = () => {
    setEditingTask(null);
    resetTaskForm();
    setIsCreatingTask(false);
  };

  const activeProjects = projects.filter(p => p.status === 'active');
  const pendingTasks = tasks.filter(t => !t.completed);
  const todayTasks = tasks.filter(t => {
    if (!t.deadline || t.completed) return false;
    const today = new Date().toDateString();
    const taskDate = new Date(t.deadline).toDateString();
    return today === taskDate;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Work Dashboard</h1>
            <p className="mt-1 text-gray-600">Manage projects, tasks, and productivity</p>
          </div>
          {!isCreatingProject && !isCreatingTask && (
            <div className="flex gap-3">
              <button
                onClick={() => setIsCreatingProject(true)}
                className="rounded-lg border-2 border-blue-200 bg-white px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 transition-colors"
              >
                + New Project
              </button>
              <button
                onClick={() => {
                  if (projects.length === 0) {
                    alert('Please create a project first!');
                    return;
                  }
                  setTaskForm({ ...taskForm, projectId: projects[0].id });
                  setIsCreatingTask(true);
                }}
                className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
              >
                + New Task
              </button>
            </div>
          )}
        </div>

        {isCreatingProject && (
          <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingProject ? 'Edit Project' : 'Create New Project'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Title *</label>
                <input
                  type="text"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="e.g., Website Redesign"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  placeholder="Project details..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={projectForm.status}
                    onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={projectForm.priority}
                    onChange={(e) => setProjectForm({ ...projectForm, priority: parseInt(e.target.value) as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>High Priority</option>
                    <option value={2}>Medium Priority</option>
                    <option value={3}>Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={editingProject ? updateProject : createProject}
                  disabled={!projectForm.title.trim()}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {editingProject ? 'Update Project' : 'Create Project'}
                </button>
                <button
                  onClick={cancelProjectEdit}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {isCreatingTask && (
          <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="e.g., Design homepage mockup"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project *</label>
                  <select
                    value={taskForm.projectId}
                    onChange={(e) => setTaskForm({ ...taskForm, projectId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: parseInt(e.target.value) as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value={1}>High</option>
                    <option value={2}>Medium</option>
                    <option value={3}>Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                  <input
                    type="date"
                    value={taskForm.deadline}
                    onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={editingTask ? updateTask : createTask}
                  disabled={!taskForm.title.trim() || !taskForm.projectId}
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {editingTask ? 'Update Task' : 'Create Task'}
                </button>
                <button
                  onClick={cancelTaskEdit}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Active Projects</h3>
              <span className="text-3xl">📁</span>
            </div>
            <p className="text-4xl font-bold text-blue-600">{activeProjects.length}</p>
            <p className="mt-1 text-sm text-gray-600">{projects.filter(p => p.status === 'completed').length} completed</p>
          </div>

          <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Pending Tasks</h3>
              <span className="text-3xl">✓</span>
            </div>
            <p className="text-4xl font-bold text-purple-600">{pendingTasks.length}</p>
            <p className="mt-1 text-sm text-gray-600">{tasks.filter(t => t.completed).length} completed</p>
          </div>

          <div className="rounded-xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Due Today</h3>
              <span className="text-3xl">⏱️</span>
            </div>
            <p className="text-4xl font-bold text-orange-600">{todayTasks.length}</p>
            <p className="mt-1 text-sm text-gray-600">Tasks need attention</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border-2 border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Projects</h3>
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📁</div>
                <p className="text-gray-500">No projects yet</p>
                <button
                  onClick={() => setIsCreatingProject(true)}
                  className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Create your first project
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map(project => (
                  <div
                    key={project.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      project.status === 'completed'
                        ? 'border-green-200 bg-green-50'
                        : project.status === 'paused'
                        ? 'border-gray-200 bg-gray-50'
                        : 'border-blue-200 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{project.title}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${PRIORITY_COLORS[project.priority]} text-white`}>
                            {PRIORITY_LABELS[project.priority]}
                          </span>
                        </div>
                        {project.description && (
                          <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="capitalize">{project.status}</span>
                          <span>•</span>
                          <span>{tasks.filter(t => t.projectId === project.id && !t.completed).length} tasks</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => startEditProject(project)}
                          className="text-blue-600 hover:text-blue-700 p-1"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteProject(project.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border-2 border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasks</h3>
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✓</div>
                <p className="text-gray-500">No tasks yet</p>
                {projects.length > 0 && (
                  <button
                    onClick={() => {
                      setTaskForm({ ...taskForm, projectId: projects[0].id });
                      setIsCreatingTask(true);
                    }}
                    className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Create your first task
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {tasks.map(task => {
                  const project = projects.find(p => p.id === task.projectId);
                  return (
                    <div
                      key={task.id}
                      className={`p-3 rounded-lg border transition-all ${
                        task.completed
                          ? 'border-gray-200 bg-gray-50'
                          : 'border-purple-200 bg-purple-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleTaskComplete(task.id)}
                          className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            task.completed
                              ? 'border-green-500 bg-green-500'
                              : 'border-gray-300 hover:border-purple-500'
                          }`}
                        >
                          {task.completed && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-sm ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">{project?.title}</span>
                            <span className={`px-1.5 py-0.5 rounded text-xs font-medium bg-gradient-to-r ${PRIORITY_COLORS[task.priority]} text-white`}>
                              {PRIORITY_LABELS[task.priority]}
                            </span>
                            {task.deadline && (
                              <span className="text-xs text-gray-500">
                                {new Date(task.deadline).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => startEditTask(task)}
                            className="text-blue-600 hover:text-blue-700 p-1"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="text-red-600 hover:text-red-700 p-1"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
