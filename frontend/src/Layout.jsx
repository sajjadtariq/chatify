export default function Layout({ className, children }) {

    return (
        <main className={`w-full h-full ${className}`}>
            {children}
        </main>
    )
}
