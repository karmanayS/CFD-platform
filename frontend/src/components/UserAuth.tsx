import { useRef, useState } from "react"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"
import { Link } from "react-router-dom"

export function UserAuth({ isSignin }: { isSignin: boolean }) {
    const emailRef = useRef("")
    const [loading,setLoading] = useState(false)

    return (
        <div className="flex justify-center items-center w-full min-h-screen p-6">
            <div className="flex flex-col p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.3)] w-full max-w-sm justify-center items-center">
                
                {/* Title */}
                <h2 className="text-center text-xl font-semibold text-gray-100 mb-6 tracking-wide">
                    {isSignin ? "Sign In" : "Sign Up"}
                </h2>

                {/* Email Input */}
                <input
                    type="text"
                    placeholder="johndoe@gmail.com"
                    onChange={(e) => (emailRef.current = e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition"
                />

                {/* Submit Button */}
                <button
                    onClick={async () => {
                        try {
                            setLoading(true)
                            const url = isSignin ? `${import.meta.env.VITE_API_BASE_URL}/signin` : `${import.meta.env.VITE_API_BASE_URL}/signup`
                            const response = await axios.post(url, {
                                email : emailRef.current
                            })
                            if (!response.data.success) throw new Error("Error: please check your credentials or try again later")
                            toast.success("Email sent successfully")
                            setLoading(false)
                        } catch(err) {
                            setLoading(false)
                            if (err instanceof Error) {
                                toast.error(err.message)
                            }
                        }
                    }}
                    className="w-full py-2 my-6 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-medium text-sm tracking-wide shadow-[0_0_20px_rgba(56,189,248,0.4)] hover:opacity-90 transition"
                >
                    {loading ? "Please wait ..." : (isSignin ? "Sign in" : "Sign up")}
                </button>

                { (isSignin) ? <div> New user ? <Link className="underline" to="/signup" >Signup</Link> </div> : <div> Already a member ? <Link className="underline" to="/signin">Signin</Link> </div> }
            </div>
            <Toaster />
        </div>
    )
}
