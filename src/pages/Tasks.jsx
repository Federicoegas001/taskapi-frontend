import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await api.get('/api/tasks');
            setTasks(response.data);
        } catch (err) {
            navigate('/login');
        }
    };

    const createTask = async () => {
        if (!title) { setError('El título es obligatorio'); return; }
        try {
            await api.post('/api/tasks', { title, description, completed: false });
            setTitle('');
            setDescription('');
            setError('');
            fetchTasks();
        } catch (err) {
            setError('Error al crear la tarea');
        }
    };

    const deleteTask = async (id) => {
        try {
            await api.delete(`/api/tasks/${id}`);
            fetchTasks();
        } catch (err) {
            setError('Error al eliminar la tarea');
        }
    };

    const toggleComplete = async (task) => {
        try {
            await api.put(`/api/tasks/${task.id}`, {
                ...task,
                completed: !task.completed
            });
            fetchTasks();
        } catch (err) {
            setError('Error al actualizar la tarea');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-2xl mx-auto flex flex-col gap-6">

                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Mis Tareas</h1>
                    <Button variant="outline" onClick={handleLogout}>Cerrar sesión</Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Nueva tarea</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <div className="flex flex-col gap-1">
                            <Label>Título</Label>
                            <Input
                                placeholder="Título"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label>Descripción</Label>
                            <Input
                                placeholder="Descripción"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>
                        <Button onClick={createTask} className="w-full">Agregar tarea</Button>
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-3">
                    {tasks.length === 0 && (
                        <p className="text-center text-gray-500">No tenés tareas todavía.</p>
                    )}
                    {tasks.map(task => (
                        <Card key={task.id} className={task.completed ? 'opacity-60' : ''}>
                            <CardContent className="flex justify-between items-center py-4">
                                <div>
                                    <p className={`font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>
                                        {task.title}
                                    </p>
                                    {task.description && (
                                        <p className="text-sm text-gray-500">{task.description}</p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => toggleComplete(task)}
                                    >
                                        {task.completed ? 'Desmarcar' : 'Completar'}
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => deleteTask(task.id)}
                                    >
                                        Eliminar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default Tasks;