export const ResponseModal = ({ isOpen, onClose, response }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);


    const openModal = (report) => {
        setSelectedReport(report);
        setData({
            status: report.status,
            pesan: '', 
            foto_tanggapan: null,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedReport(null);
        reset(); 
    };
    
    return (
        <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
            <form onSubmit={submitStatus} className="p-6">
                <h2 className="text-xl font-black text-blue-900 mb-6 flex items-center gap-2">
                    <span className="p-2 bg-yellow-400 rounded-lg">⚙️</span>
                    Update Progres Laporan
                </h2>

                <div className="space-y-5">
                    {/* Pilih Status */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">Status Saat Ini</label>
                        <select 
                            value={data.status}
                            onChange={e => setData('status', e.target.value)}
                            className="w-full border-gray-200 rounded-xl focus:ring-blue-900 focus:border-blue-900 transition"
                        >
                            <option value="menunggu">Menunggu Verifikasi</option>
                            <option value="diverifikasi">Diverifikasi</option>
                            <option value="diproses">Dalam Perbaikan (Proses)</option>
                            <option value="selesai">Selesai Dikerjakan</option>
                            <option value="ditolak">Ditolak / Salah Alamat</option>
                        </select>
                    </div>

                    {/* Pesan/Tanggapan */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">
                            {data.status === 'Ditolak' ? 'Alasan Penolakan' : 'Pesan/Catatan Progres'}
                        </label>
                        <textarea 
                            value={data.pesan}
                            onChange={e => setData('pesan', e.target.value)}
                            placeholder="Berikan penjelasan detil untuk warga..."
                            className="w-full border-gray-200 rounded-xl focus:ring-blue-900 min-h-[120px]"
                        />
                        {errors.pesan && <p className="text-red-500 text-xs mt-1">{errors.pesan}</p>}
                    </div>

                    {/* Upload Foto (Custom Drag & Drop Style) */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">Lampiran Foto Progres (Opsional)</label>
                        <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition">
                            <input 
                                type="file" 
                                onChange={e => setData('foto_tanggapan', e.target.files[0])}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="text-center">
                                <p className="text-sm text-gray-600 font-medium">
                                    {data.foto_tanggapan ? data.foto_tanggapan.name : 'Klik atau seret foto ke sini'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex justify-end gap-3">
                    <button 
                        type="button"
                        onClick={closeModal} 
                        className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition"
                    >
                        Batal
                    </button>
                    <button 
                        type="submit"
                        disabled={processing}
                        className="px-8 py-2.5 bg-blue-900 text-white rounded-xl font-black shadow-lg shadow-blue-200 hover:bg-blue-800 transition active:scale-95 disabled:opacity-50"
                    >
                        {processing ? 'Menyimpan...' : 'Update & Kirim Tanggapan'}
                    </button>
                </div>
            </form>
        </Modal>
    )
}