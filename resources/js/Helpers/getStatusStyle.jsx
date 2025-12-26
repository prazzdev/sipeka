export const getStatusStyle = (status) => {
    switch(status) {
        case 'selesai': return 'bg-green-100 text-green-700';
        case 'diproses': return 'bg-orange-100 text-orange-700';
        case 'diverifikasi': return 'bg-blue-100 text-blue-700';
        case 'menunggu': return 'bg-yellow-100 text-yellow-700';
        case 'ditolak': return 'bg-red-100 text-red-700';
        default: return 'bg-gray-100 text-gray-700';
    }
}