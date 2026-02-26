const amenities = [
  { icon: '🌊', name: 'Ocean Facing Rooms', desc: 'Wake to breathtaking ocean views' },
  { icon: '🎮', name: 'Games Room', desc: 'Play and unwind with family' },
  { icon: '🎬', name: 'Cinema', desc: 'Cinematic experiences with comfort' },
  { icon: '🏊', name: 'Adult Pool', desc: 'Luxury poolside lounging' },
  { icon: '👶', name: 'Kids Pool', desc: 'Safe family fun environment' },
  { icon: '🎪', name: 'Playground', desc: 'Whimsical space for children' },
  { icon: '👶‍🦱', name: 'Childminding', desc: 'Professional care services' },
  { icon: '💆', name: 'Beachside Spa', desc: 'Relaxation and wellness' },
  { icon: '🍽️', name: 'Restaurant & Bar', desc: 'Culinary experiences' },
  { icon: '🏃', name: 'Jungle Gym', desc: 'Nature-inspired activities' },
  { icon: '🔥', name: 'Fire Pit', desc: 'Cozy evening gatherings' },
  { icon: '📡', name: 'High-Speed WiFi', desc: 'Seamless connectivity' },
]

export default function Amenities() {
  return (
    <section id="amenities" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl font-light text-blue-900 mb-4" style={{ fontFamily: 'Cormorant Garamond' }}>
          World-Class Amenities
        </h2>
        <p className="text-gray-600 font-light mb-16 max-w-2xl">
          Everything you need for an unforgettable stay, from premium facilities to thoughtful services.
        </p>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {amenities.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg border border-gray-100 hover:border-blue-200 transition">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-light text-gray-900 mb-2">{item.name}</h3>
              <p className="text-sm text-gray-600 font-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
