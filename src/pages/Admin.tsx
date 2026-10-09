import React, { useEffect, useState } from 'react';
import { useSupabase } from '../context/SupabaseContext';
import { Pencil, Trash2, Check, X, RefreshCw, Filter, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

interface ServiceRequest {
  id: number;
  created_at: string;
  name: string;
  phone: string;
  address: string;
  service_type: string;
  message: string | null;
  status: string;
  appointment_date: string | null;
  appointment_time: string | null;
  is_read: boolean;
  admin_notes: string | null;
  priority: string;
}

function Admin() {
  const { supabase } = useSupabase();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<ServiceRequest>>({});
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isReadFilter, setIsReadFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user || session.user.email !== 'admin@vodopoverka.com') {
        navigate('/login');
        return;
      }
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth error:', error);
      navigate('/login');
    }
  };

  const fetchRequests = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('service_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      if (isReadFilter !== 'all') {
        query = query.eq('is_read', isReadFilter === 'read');
      }
      if (priorityFilter !== 'all') {
        query = query.eq('priority', priorityFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      alert('Ошибка при загрузке заявок');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchRequests();
    }
  }, [statusFilter, isReadFilter, priorityFilter, isAuthenticated]);

  const handleEdit = (request: ServiceRequest) => {
    setEditingId(request.id);
    setEditForm(request);
  };

  const handleSave = async () => {
    if (!editingId) return;

    try {
      const { error } = await supabase
        .from('service_requests')
        .update(editForm)
        .eq('id', editingId);

      if (error) throw error;

      await fetchRequests();
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      console.error('Error updating request:', error);
      alert('Ошибка при обновлении заявки');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту заявку?')) return;

    try {
      const { error } = await supabase
        .from('service_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchRequests();
    } catch (error) {
      console.error('Error deleting request:', error);
      alert('Ошибка при удалении заявки');
    }
  };

  const toggleReadStatus = async (request: ServiceRequest) => {
    try {
      const { error } = await supabase
        .from('service_requests')
        .update({ is_read: !request.is_read })
        .eq('id', request.id);

      if (error) throw error;
      await fetchRequests();
    } catch (error) {
      console.error('Error updating read status:', error);
      alert('Ошибка при обновлении статуса прочтения');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'normal':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new':
        return 'Новая';
      case 'in_progress':
        return 'В обработке';
      case 'completed':
        return 'Выполнена';
      case 'cancelled':
        return 'Отменена';
      default:
        return status;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'Срочно';
      case 'high':
        return 'Высокий';
      case 'normal':
        return 'Обычный';
      case 'low':
        return 'Низкий';
      default:
        return priority;
    }
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd.MM.yyyy HH:mm', { locale: ru });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Панель администратора</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Все статусы</option>
                <option value="new">Новые</option>
                <option value="in_progress">В обработке</option>
                <option value="completed">Выполненные</option>
                <option value="cancelled">Отмененные</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-gray-500" />
              <select
                value={isReadFilter}
                onChange={(e) => setIsReadFilter(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Все заявки</option>
                <option value="unread">Непрочитанные</option>
                <option value="read">Прочитанные</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-gray-500" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Все приоритеты</option>
                <option value="urgent">Срочные</option>
                <option value="high">Высокий</option>
                <option value="normal">Обычный</option>
                <option value="low">Низкий</option>
              </select>
            </div>
            <button
              onClick={fetchRequests}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Обновить
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Загрузка заявок...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Имя</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Телефон</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Адрес</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Услуга</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата визита</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Время визита</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сообщение</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Приоритет</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Заметки</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.map(request => (
                    <tr key={request.id} className={`hover:bg-gray-50 ${!request.is_read ? 'bg-blue-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === request.id ? (
                          <select
                            name="status"
                            value={editForm.status || ''}
                            onChange={handleChange}
                            className="w-full px-2 py-1 border rounded"
                          >
                            <option value="new">Новая</option>
                            <option value="in_progress">В обработке</option>
                            <option value="completed">Выполнена</option>
                            <option value="cancelled">Отменена</option>
                          </select>
                        ) : (
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(request.status)}`}>
                            {getStatusText(request.status)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(request.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === request.id ? (
                          <input
                            type="text"
                            name="name"
                            value={editForm.name || ''}
                            onChange={handleChange}
                            className="w-full px-2 py-1 border rounded"
                          />
                        ) : (
                          <span className="text-sm text-gray-900">{request.name}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === request.id ? (
                          <input
                            type="text"
                            name="phone"
                            value={editForm.phone || ''}
                            onChange={handleChange}
                            className="w-full px-2 py-1 border rounded"
                          />
                        ) : (
                          <a 
                            href={`tel:${request.phone}`} 
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            {request.phone}
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === request.id ? (
                          <input
                            type="text"
                            name="address"
                            value={editForm.address || ''}
                            onChange={handleChange}
                            className="w-full px-2 py-1 border rounded"
                          />
                        ) : (
                          <span className="text-sm text-gray-900">{request.address}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === request.id ? (
                          <select
                            name="service_type"
                            value={editForm.service_type || ''}
                            onChange={handleChange}
                            className="w-full px-2 py-1 border rounded"
                          >
                            <option value="Поверка счетчиков воды">Поверка счетчиков воды</option>
                            <option value="Поверка многотарифного счетчика на горячую воду ЛВ-4Т">Поверка многотарифного счетчика ЛВ-4Т</option>
                            <option value="Поверка счетчика тепла">Поверка счетчика тепла</option>
                            <option value="Замена счетчика воды под ключ">Замена счетчика воды под ключ</option>
                            <option value="Обратный звонок">Обратный звонок</option>
                          </select>
                        ) : (
                          <span className="text-sm text-gray-900">{request.service_type}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {request.appointment_date ? format(new Date(request.appointment_date), 'dd.MM.yyyy', { locale: ru }) : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {request.appointment_time ? format(new Date(`2000-01-01T${request.appointment_time}`), 'HH:mm', { locale: ru }) : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {editingId === request.id ? (
                          <textarea
                            name="message"
                            value={editForm.message || ''}
                            onChange={handleChange}
                            className="w-full px-2 py-1 border rounded"
                            rows={2}
                          />
                        ) : (
                          <span className="text-sm text-gray-900">{request.message || '-'}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === request.id ? (
                          <select
                            name="priority"
                            value={editForm.priority || 'normal'}
                            onChange={handleChange}
                            className="w-full px-2 py-1 border rounded"
                          >
                            <option value="urgent">Срочно</option>
                            <option value="high">Высокий</option>
                            <option value="normal">Обычный</option>
                            <option value="low">Низкий</option>
                          </select>
                        ) : (
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadgeClass(request.priority)}`}>
                            {getPriorityText(request.priority)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingId === request.id ? (
                          <textarea
                            name="admin_notes"
                            value={editForm.admin_notes || ''}
                            onChange={handleChange}
                            className="w-full px-2 py-1 border rounded"
                            rows={2}
                            placeholder="Внутренние заметки"
                          />
                        ) : (
                          <span className="text-sm text-gray-900">{request.admin_notes || '-'}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex gap-2 justify-end">
                          {editingId === request.id ? (
                            <>
                              <button
                                onClick={handleSave}
                                className="text-green-600 hover:text-green-900"
                              >
                                <Check className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingId(null);
                                  setEditForm({});
                                }}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => toggleReadStatus(request)}
                                className={`${request.is_read ? 'text-gray-400' : 'text-blue-600'} hover:text-blue-900`}
                                title={request.is_read ? 'Отметить как непрочитанное' : 'Отметить как прочитанное'}
                              >
                                {request.is_read ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                              <button
                                onClick={() => handleEdit(request)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Pencil className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(request.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;