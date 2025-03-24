import '@/app/globals.css';

export default function AboutPage() {
  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">About NBA Streams</h1>
      <p className="text-lg mb-4">
        NBA Streams provides an easy-to-use platform for basketball fans to find and watch NBA games. We offer both user accounts and guest access for quick viewing.
      </p>
      <p className="text-lg mb-4">
        Users can enjoy personalised features, while guests can watch games instantly. We aim to deliver a seamless streaming experience.
      </p>
      <p className="text-sm text-gray-500">
        Disclaimer: This application links to external streams. Availability and quality may vary.
      </p>
    </div>
  );
}