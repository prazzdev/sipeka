export const StatCard = ({ title, value, icon, color }) => {
    return (
        <div className={`${color} p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4`}>
            <div className="p-3 bg-white rounded-lg shadow-inner">{icon}</div>
            <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{title}</p>
                <p className="text-2xl font-black text-gray-900">{value}</p>
            </div>
        </div>
    );
}