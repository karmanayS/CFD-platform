import { UsdBalance } from "./UsdBalance"

export const Navbar = () => {
  return (
    <div className="flex items-center justify-between w-full p-4 mb-6 ">
      <div className="text-2xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-wide">
        Welcome, User
      </div>
      <UsdBalance />
    </div>
  )
}
