import React, { useState } from 'react';
import { Search, Eye, Check, X, Clock, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { useReservations } from '../../hooks/useSupabaseData';

export function ReservationsManager() {
  const { reservations, loading, error, updateReservationStatus } = useReservations();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         reservation.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         reservation.customerPhone.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (id: string, status: 'confirmed' | 'completed' | 'cancelled') => {
    const result = await updateReservationStatus(id, status);
    if (!result.success) {
      alert(`Failed to update reservation: ${result.error}`);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Reservations</h1>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Reservations</h1>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Error loading reservations: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reservations</h1>
          <p className="text-gray-600">Manage customer reservations</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search reservations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Reservations List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="divide-y divide-gray-200">
          {filteredReservations.map((reservation) => (
            <div key={reservation.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {reservation.customerName}
                    </h3>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      reservation.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {reservation.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Reference</p>
                      <p className="font-medium">{reservation.referenceNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{reservation.customerPhone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pickup Date</p>
                      <p className="font-medium">{reservation.proposedDate} at {reservation.proposedTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-medium text-blue-600">${reservation.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Items ({reservation.items.length})</p>
                    <div className="space-y-1">
                      {reservation.items.slice(0, 3).map((item: any, index: number) => (
                        <p key={index} className="text-sm text-gray-900">
                          {item.product.name} x{item.quantity} - ${(item.product.price * item.quantity).toLocaleString()}
                        </p>
                      ))}
                      {reservation.items.length > 3 && (
                        <p className="text-sm text-gray-500">
                          +{reservation.items.length - 3} more items
                        </p>
                      )}
                    </div>
                  </div>

                  {reservation.notes && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">Notes</p>
                      <p className="text-sm text-gray-900">{reservation.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2 ml-6">
                  <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50">
                    <Eye className="w-5 h-5" />
                  </button>
                  
                  {reservation.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(reservation.id, 'confirmed')}
                        className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50"
                        title="Confirm reservation"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(reservation.id, 'cancelled')}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        title="Cancel reservation"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  
                  {reservation.status === 'confirmed' && (
                    <button
                      onClick={() => handleStatusUpdate(reservation.id, 'completed')}
                      className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                      title="Mark as completed"
                    >
                      <Clock className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReservations.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reservations found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}