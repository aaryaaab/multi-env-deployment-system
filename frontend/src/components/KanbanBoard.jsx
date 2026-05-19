import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Clock, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const COLUMN_COLORS = {
  'Todo': 'border-blue-500',
  'In Progress': 'border-amber-500',
  'Completed': 'border-emerald-500'
};

const COLUMN_BG = {
  'Todo': 'bg-blue-500/10',
  'In Progress': 'bg-amber-500/10',
  'Completed': 'bg-emerald-500/10'
};

export const KanbanBoard = ({ tasks, onDragEnd, onEdit, onDelete }) => {
  const columns = ['Todo', 'In Progress', 'Completed'];

  const getTasksByStatus = (status) => {
    // Handle legacy 'To Do' mapping
    const lookupStatus = status === 'Todo' ? ['Todo', 'To Do'] : [status];
    return tasks.filter(task => lookupStatus.includes(task.status));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((columnId) => (
          <div key={columnId} className="flex flex-col h-full">
            <div className={`mb-4 pb-2 border-b-2 ${COLUMN_COLORS[columnId]} flex justify-between items-center`}>
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">{columnId}</h3>
              <span className="px-2 py-1 text-xs font-bold rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                {getTasksByStatus(columnId).length}
              </span>
            </div>
            
            <Droppable droppableId={columnId}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`flex-1 rounded-xl p-3 min-h-[300px] transition-colors ${
                    snapshot.isDraggingOver ? COLUMN_BG[columnId] : 'bg-slate-100 dark:bg-slate-800/50'
                  }`}
                >
                  {getTasksByStatus(columnId).map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`mb-3 p-4 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 ${
                            snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500 rotate-2' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className={`font-semibold ${task.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-100'}`}>
                              {task.title}
                            </h4>
                            <div className="flex gap-1">
                              <button onClick={() => onEdit(task)} className="p-1 text-slate-400 hover:text-blue-500 transition">
                                <Edit2 size={14} />
                              </button>
                              <button onClick={() => onDelete(task._id)} className="p-1 text-slate-400 hover:text-rose-500 transition">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                          
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">
                            {task.description}
                          </p>
                          
                          <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100 dark:border-slate-700">
                            <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full ${
                              task.priority === 'High' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400' : 
                              task.priority === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' : 
                              'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                            }`}>
                              {task.priority || 'Medium'}
                            </span>
                            
                            {task.dueDate && (
                              <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                                <Clock size={12} />
                                {format(new Date(task.dueDate), 'MMM dd')}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};
