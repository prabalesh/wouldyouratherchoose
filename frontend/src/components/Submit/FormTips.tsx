export default function FormTips() {
  return (
    <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">💡 Tips for great questions</h3>
      <ul className="space-y-2 text-gray-600">
        <li className="flex items-start"><span className="text-purple-500 mr-2">•</span>Keep your question clear and engaging</li>
        <li className="flex items-start"><span className="text-blue-500 mr-2">•</span>Make sure both options are equally appealing</li>
        <li className="flex items-start"><span className="text-cyan-500 mr-2">•</span>Avoid controversial or sensitive topics</li>
      </ul>
    </div>
  );
}
