import '@/app/globals.css';

export default function ContactPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

      <p className="text-lg mb-4">
        Please feel free to reach out with any questions, feedback, or concerns.
      </p>

      <div>
        <h2 className="text-xl font-semibold mb-2">Feedback Form</h2>
        <form className="mt-4">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" id="name" className="mt-1 p-2 border rounded w-full" />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" className="mt-1 p-2 border rounded w-full" />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
            <textarea id="message" rows={4} className="mt-1 p-2 border rounded w-full" />
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}