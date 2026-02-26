const reviews = [
  {
    name: 'Amara O.',
    rating: 5,
    text: 'Absolutely stunning. The overwater rooms are extraordinary—waking up to ocean views changed my life. Impeccable service, exceptional food.',
    category: 'Aesthetics & Amenities',
  },
  {
    name: 'Chisom P.',
    rating: 5,
    text: 'Best family vacation ever. Our kids loved the playground and pool area. The staff treated us like family. We\'re already planning our next visit.',
    category: 'Family Experience',
  },
  {
    name: 'Tunde M.',
    rating: 5,
    text: 'World-class experience at this price point. Food, service, and facilities were all exceptional. The spa was rejuvenating.',
    category: 'Value & Experience',
  },
  {
    name: 'Nkechi A.',
    rating: 5,
    text: 'Seamless booking process. Real-time availability made it easy. The rooms were exactly as advertised—beautiful and well-maintained.',
    category: 'Booking & Check-in',
  },
]

export default function Reviews() {
  return (
    <section id="reviews" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl font-light text-blue-900 mb-4" style={{ fontFamily: 'Cormorant Garamond' }}>
          Guest Reviews
        </h2>
        <p className="text-gray-600 font-light mb-16 max-w-2xl">
          Don't just take our word for it—hear from guests who've experienced Ziba firsthand.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {reviews.map((review, idx) => (
            <div key={idx} className="bg-white p-8 rounded-lg border border-gray-100 hover:border-blue-200 transition">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-light text-gray-900">{review.name}</p>
                  <p className="text-xs text-gray-500 font-light mt-1">{review.category}</p>
                </div>
                <div className="text-sm text-amber-500">
                  {'★'.repeat(review.rating)}
                </div>
              </div>
              <p className="text-gray-600 font-light leading-relaxed">
                "{review.text}"
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-blue-50 border border-blue-200 p-12 rounded-lg text-center">
          <h3 className="text-2xl font-light text-gray-900 mb-4" style={{ fontFamily: 'Cormorant Garamond' }}>
            Share Your Experience
          </h3>
          <p className="text-gray-600 font-light mb-6 max-w-2xl mx-auto">
            We'd love to hear about your stay. Your feedback helps us provide better experiences and assists future guests in planning their getaway.
          </p>
          <button className="bg-blue-900 text-white px-8 py-3 text-sm font-light tracking-wide hover:bg-blue-800 transition">
            Write a Review
          </button>
        </div>
      </div>
    </section>
  )
}
