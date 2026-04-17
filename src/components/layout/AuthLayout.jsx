import { Outlet } from "react-router"
import { NavLink } from "react-router"

export default function AuthLayout() {
    return (
        <div className="min-h-screen bg-secondary flex items-center justify-center px-4 gap-12 flex-col">
            <NavLink to="/" className="font-title font-semibold text-white text-4xl">
                Uni<span className="text-tertiary">city</span>
            </NavLink>
            <section className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
                <Outlet />
            </section>
        </div>
    )
}