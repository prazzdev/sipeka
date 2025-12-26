export const getStatusColor = (status) => {
    if (status?.includes('ditolak')) return 'bg-red-500';
    if (status?.includes('selesai')) return 'bg-green-500';
    if (status?.includes('diproses')) return 'bg-orange-500'; 
    if (status?.includes('diverifikasi')) return 'bg-blue-500';
    if (status?.includes('menunggu')) return 'bg-blue-500';
    return 'bg-gray-400'; 
};