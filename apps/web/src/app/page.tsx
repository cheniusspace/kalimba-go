export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold">Kalimba Go - Web App</h1>
      </div>
      
      <div className="relative flex place-items-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Welcome to Kalimba Go</h2>
          <p className="text-lg text-gray-600">
          Kalimba Go is a simple app for learning and playing kalimba songs. Browse and display 17-key kalimba tabs with notes and lyrics in a clean, easy-to-read format—perfect for practice at home or on the go.
          </p>
        </div>
      </div>
    </main>
  )
}

