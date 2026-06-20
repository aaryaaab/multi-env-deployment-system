import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Calendar, Edit2, Trash2, GripVertical, CheckCircle2, Circle, Clock, Clipboard } from 'lucide-react';
import { format } from 'date-fns';

const COLUMN_COLORS = {
  'Todo': 'border-slate-800',
  'In Progress': 'border-indigo-500',
  'Completed': 'border-emerald-500'
};

const COLUMN_DOTS = {
  'Todo': 'bg-slate-400',
  'In Progress': 'bg-indigo-500',
  'Completed': 'bg-emerald-500'
};

const COLUMN_BG = {
  'Todo': 'bg-slate-900/10',
  'In Progress': 'bg-indigo-500/5',
  'Completed': 'bg-emerald-500/5'
};

const EMPTY_COLUMN_MESSAGES = {
  'Todo': {
    title: 'Your backlog is clear',
    desc: 'Got something new to work on? Create a task and schedule it here.'
  },
  'In Progress': {
    title: 'No active tasks',
    desc: 'Drag tasks here when you start working on them.'
  },
  'Completed': {
    title: 'No completed tasks',
    desc: 'Drag finished tasks here to resolve them and update stats.'
  }
};

export const KanbanBoard = ({ tasks = [], onDragEnd, onEdit, onDelete }) => {
  const columns = ['Todo', 'In Progress', 'Completed'];

  const getTasksByStatus = (status) => {
    const lookupStatus = status === 'Todo' ? ['Todo', 'To Do'] : [status];
    return tasks.filter(task => lookupStatus.includes(task.status));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {columns.map((columnId) => {
          const columnTasks = getTasksByStatus(columnId);
          return (
            <div key={columnId} className="flex flex-col h-full bg-slate-900/20 border border-slate-900 rounded-xl p-4 min-h-[450px]">
              {/* Column Header */}
              <div className={`mb-4 pb-2.5 border-b ${COLUMN_COLORS[columnId]} flex justify-between items-center`}>
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${COLUMN_DOTS[columnId]}`} />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-350">{columnId}</h3>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-800 text-slate-400">
                  {columnTasks.length}
                </span>
              </div>
              
              {/* Droppable Board Area */}
              <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`flex-1 rounded-lg p-1 min-h-[350px] transition-colors duration-250 ${
                      snapshot.isDraggingOver ? COLUMN_BG[columnId] : 'bg-transparent'
                    }`}
                  >
                    {columnTasks.length > 0 ? (
                      columnTasks.map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`mb-3.5 p-4 rounded-xl bg-slate-900/60 border transition-all duration-200 ${
                                snapshot.isDragging 
                                  ? 'shadow-2xl ring-2 ring-indigo-500/50 border-indigo-500 rotate-1 scale-[1.02] bg-slate-900' 
                                  : 'shadow-sm border-slate-850 hover:shadow-md hover:border-slate-800'
                              }`}
                            >
                              {/* Header & Actions */}
                              <div className="flex justify-between items-start gap-2 mb-2">
                                <div className="flex items-start gap-1.5 flex-1 min-w-0">
                                  {/* Drag Handle */}
                                  <div {...provided.dragHandleProps} className="p-1 cursor-grab active:cursor-grabbing text-slate-600 hover:text-slate-400 transition-colors">
                                    <GripVertical size={13} />
                                  </div>
                                  <h4 className={`text-xs font-bold truncate leading-tight ${task.status === 'Completed' ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                                    {task.title}
                                  </h4>
                                </div>
                                <div className="flex gap-1 shrink-0">
                                  <button onClick={() => onEdit(task)} className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-white transition" aria-label="Edit task">
                                    <Edit2 size={12} />
                                  </button>
                                  <button onClick={() => onDelete(task._id)} className="p-1 rounded hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition" aria-label="Delete task">
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </div>
                              
                              {/* Task Description */}
                              <p className="text-[11px] text-slate-400 mb-3.5 line-clamp-2 leading-relaxed pl-6">
                                {task.description}
                              </p>
                              
                              {/* Footer details */}
                              <div className="flex items-center justify-between mt-auto pt-2.5 border-t border-slate-850 pl-6">
                                <span className={`px-2 py-0.5 text-[8px] uppercase tracking-wider font-bold rounded-md ${
                                  task.priority === 'High' ? 'bg-rose-500/10 text-rose-400' : 
                                  task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 
                                  'bg-blue-500/10 text-blue-400'
                                }`}>
                                  {task.priority || 'Medium'}
                                </span>
                                
                                {task.dueDate && (
                                  <span className="flex items-center gap-1 text-[10px] text-slate-450 font-medium">
                                    <Calendar size={11} />
                                    {format(new Date(task.dueDate), 'MMM dd')}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      // Empty Column Guidance
                      <div className="h-full flex flex-col items-center justify-center border border-dashed border-slate-850 rounded-lg p-6 py-12 text-center">
                        <div className="text-slate-600 mb-2">
                          <Clipboard size={18} />
                        </div>
                        <p className="text-xs font-semibold text-slate-450">
                          {EMPTY_COLUMN_MESSAGES[columnId].title}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1 max-w-[170px] leading-normal">
                          {EMPTY_COLUMN_MESSAGES[columnId].desc}
                        </p>
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};
