import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const response = await api.post('/auth/register', { username, password });
            localStorage.setItem('token', response.data);
            navigate('/tasks');
        } catch (err) {
            setError('Error al registrarse, el usuario ya existe');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Registrarse</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <div className="flex flex-col gap-1">
                        <Label>Usuario</Label>
                        <Input
                            placeholder="Usuario"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label>Contraseña</Label>
                        <Input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleRegister} className="w-full">Registrarse</Button>
                    <p className="text-sm text-center text-gray-500">
                        ¿Ya tenés cuenta? <a href="/login" className="text-blue-500 hover:underline">Iniciá sesión</a>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

export default Register;