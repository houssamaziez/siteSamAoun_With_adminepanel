import React, { useState } from 'react';
import { Search, Eye, Check, X, Clock, Calendar, Phone, MapPin, Package, User, DollarSign, Filter, Download, RefreshCw, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useReservations } from '../../hooks/useSupabaseData';

export function ReservationsManager() {
  const { reservations, loading, error, updateReservationStatus, refetch } = useReservations();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         reservation.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         reservation.customerPhone.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    
    const matchesDate = dateFilter === 'all' || (() => {
      const reservationDate = new Date(reservation.createdAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      switch (dateFilter) {
        case 'today':
          return reservationDate.toDateString() === today.toDateString();
        case 'yesterday':
          return reservationDate.toDateString() === yesterday.toDateString();
        case 'week':
          return reservationDate >= weekAgo;
        default:
          return true;
      }
    })();
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleStatusUpdate = async (id: string, status: 'confirmed' | 'completed' | 'cancelled') => {
    const result = await updateReservationStatus(id, status);
    if (!result.success) {
      alert(`Failed to update reservation: ${result.error}`);
    }
  };

  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
        return <Check className="w-4 h-4" />;
      case 'completed':
        return <Package className="w-4 h-4" />;
      case 'cancelled':
        return <X className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const stats = {
    total: reservations.length,
    pending: reservations.filter(r => r.status === 'pending').length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    completed: reservations.filter(r => r.status === 'completed').length,
    cancelled: reservations.filter(r => r.status === 'cancelled').length,
    totalValue: reservations.reduce((sum, r) => sum + r.totalAmount, 0)
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
          <h1 className="text-2xl font-bold text-gray-900">Reservations Management</h1>
          <p className="text-gray-600">Monitor and manage customer reservations</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" icon={Download} size="sm">
            Export
          </Button>
          <Button variant="outline" icon={RefreshCw} size="sm" onClick={refetch}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-600">Pending</p>
              <p className="text-2xl font-bold text-amber-900">{stats.pending}</p>
            </div>
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Confirmed</p>
              <p className="text-2xl font-bold text-blue-900">{stats.confirmed}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Completed</p>
              <p className="text-2xl font-bold text-green-900">{stats.completed}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Package className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Cancelled</p>
              <p className="text-2xl font-bold text-red-900">{stats.cancelled}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <X className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Total Value</p>
              <p className="text-lg font-bold text-purple-900">{stats.totalValue.toLocaleString()} د.ج</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, reference, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">Last 7 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Reference</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Customer</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Pickup Details</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Amount</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Created</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredReservations.map((reservation) => (
                <React.Fragment key={reservation.id}>
                  <tr className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleRowExpansion(reservation.id)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors duration-150"
                        >
                          {expandedRows.has(reservation.id) ? (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                        <div>
                          <p className="font-mono text-sm font-semibold text-blue-600">
                            {reservation.referenceNumber}
                          </p>
                          <p className="text-xs text-gray-500">
                            {reservation.items.length} item{reservation.items.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{reservation.customerName}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Phone className="w-3 h-3" />
                            <span>{reservation.customerPhone}</span>
                          </div>
                          {reservation.customerWhatsApp && (
                            <div className="flex items-center space-x-2 text-sm text-green-600">
                              <span className="text-xs">Wilaya:</span>
                              <span>{reservation.customerWhatsApp}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">{reservation.pickupBranch}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{reservation.proposedDate}</span>
                          <span className="text-gray-400">•</span>
                          <span>{reservation.proposedTime}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {reservation.totalAmount.toLocaleString()} د.ج
                        </p>
                        <p className="text-sm text-gray-500">
                          {Math.round(reservation.totalAmount / reservation.items.length).toLocaleString()} د.ج avg
                        </p>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(reservation.status)}`}>
                        {getStatusIcon(reservation.status)}
                        <span className="capitalize">{reservation.status}</span>
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="text-sm">
                        <p className="text-gray-900">
                          {new Date(reservation.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-gray-500">
                          {new Date(reservation.createdAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedReservation(reservation)}
                          className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-150"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {reservation.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(reservation.id, 'confirmed')}
                              className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors duration-150"
                              title="Confirm reservation"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(reservation.id, 'cancelled')}
                              className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-150"
                              title="Cancel reservation"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        
                        {reservation.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusUpdate(reservation.id, 'completed')}
                            className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-150"
                            title="Mark as completed"
                          >
                            <Package className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Row Details */}
                  {expandedRows.has(reservation.id) && (
                    <tr className="bg-gray-50">
                      <td colSpan={7} className="px-6 py-4">
                        <div className="space-y-4">
                          {/* Items List */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                              <Package className="w-4 h-4 mr-2" />
                              Reserved Items ({reservation.items.length})
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {reservation.items.map((item: any, index: number) => (
                                <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                                  <div className="flex items-center space-x-3">
                                    <img
                                      src={item.product.images?.[0] || '/placeholder.jpg'}
                                      alt={item.product.name}
                                      className="w-12 h-12 rounded-lg object-cover"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-gray-900 truncate">
                                        {item.product.name}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {item.product.brand}
                                      </p>
                                      <div className="flex items-center justify-between mt-1">
                                        <span className="text-sm font-medium text-blue-600">
                                          Qty: {item.quantity}
                                        </span>
                                        <span className="text-sm font-bold text-gray-900">
                                          {(item.product.price * item.quantity).toLocaleString()} د.ج
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  {item.notes && (
                                    <div className="mt-2 pt-2 border-t border-gray-100">
                                      <p className="text-xs text-gray-600">
                                        <span className="font-medium">Notes:</span> {item.notes}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Notes */}
                          {reservation.notes && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Customer Notes</h4>
                              <div className="bg-white rounded-lg p-3 border border-gray-200">
                                <p className="text-gray-700">{reservation.notes}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReservations.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reservations found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Reservation Detail Modal */}
      {selectedReservation && (
        <ReservationDetailModal
          reservation={selectedReservation}
          onClose={() => setSelectedReservation(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}

// Reservation Detail Modal Component
function ReservationDetailModal({ reservation, onClose, onStatusUpdate }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Reservation Details</h2>
              <p className="text-blue-600 font-mono font-semibold">{reservation.referenceNumber}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-50 rounded-full transition-colors duration-150">
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <div className="p-6 max-h-[600px] overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Customer Information */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Customer Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Name</label>
                      <p className="text-gray-900 font-semibold">{reservation.customerName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Phone</label>
                      <p className="text-gray-900">{reservation.customerPhone}</p>
                    </div>
                    {reservation.customerWhatsApp && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">WhatsApp</label>
                        <p className="text-green-600">{reservation.customerWhatsApp}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-gray-600">Pickup Branch</label>
                      <p className="text-gray-900">{reservation.pickupBranch}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Pickup Date & Time</label>
                      <p className="text-gray-900">{reservation.proposedDate} at {reservation.proposedTime}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Status</label>
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 text-sm font-medium rounded-full border ${
                        reservation.status === 'pending' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                        reservation.status === 'confirmed' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        reservation.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                        'bg-red-100 text-red-800 border-red-200'
                      }`}>
                        <span className="capitalize">{reservation.status}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items and Summary */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {/* Items */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Package className="w-5 h-5 mr-2 text-blue-600" />
                      Reserved Items ({reservation.items.length})
                    </h3>
                    <div className="space-y-3">
                      {reservation.items.map((item: any, index: number) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center space-x-4">
                            <img
                              src={item.product.images?.[0] || '/placeholder.jpg'}
                              alt={item.product.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{item.product.name}</h4>
                              <p className="text-gray-600">{item.product.brand}</p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-sm text-gray-600">Quantity: {item.quantity}</span>
                                <span className="font-bold text-blue-600">
                                  {(item.product.price * item.quantity).toLocaleString()} د.ج
                                </span>
                              </div>
                            </div>
                          </div>
                          {item.notes && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Notes:</span> {item.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                      Order Summary
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Items ({reservation.items.length})</span>
                        <span className="font-medium">{reservation.totalAmount.toLocaleString()} د.ج</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-blue-600 pt-2 border-t border-blue-200">
                        <span>Total Amount</span>
                        <span>{reservation.totalAmount.toLocaleString()} د.ج</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {reservation.notes && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Notes</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700">{reservation.notes}</p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    {reservation.status === 'pending' && (
                      <>
                        <Button
                          onClick={() => {
                            onStatusUpdate(reservation.id, 'confirmed');
                            onClose();
                          }}
                          icon={Check}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Confirm Reservation
                        </Button>
                        <Button
                          onClick={() => {
                            onStatusUpdate(reservation.id, 'cancelled');
                            onClose();
                          }}
                          variant="danger"
                          icon={X}
                        >
                          Cancel Reservation
                        </Button>
                      </>
                    )}
                    
                    {reservation.status === 'confirmed' && (
                      <Button
                        onClick={() => {
                          onStatusUpdate(reservation.id, 'completed');
                          onClose();
                        }}
                        icon={Package}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Mark as Completed
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}