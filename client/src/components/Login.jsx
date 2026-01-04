import React from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {
    const {setShowUserLogin, setUser, axios, navigate} = useAppContext();

    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [otp, setOtp] = React.useState("");

    const sendOtp = async () => {
        try {
            const {data} = await axios.post(`/api/user/${state}`, { name, email, password });
            if(data.success){
                toast.success("OTP sent to email.")
                setState("register")
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }; 

    const onSubmitHandler = async (event) =>{
        try {
            event.preventDefault();

            const {data} = await axios.post(`/api/user/${state}`, { name, email, password, otp });

            if(data.success){
                navigate('/')
                setUser(data.user)
                setShowUserLogin(false)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div onClick={()=> setShowUserLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50'>
            <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
                <p className="text-2xl font-medium m-auto">
                    <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}         
                </p>
                {state === "otp-verification" && (
                    <div className="w-full">
                        <p>Name</p>
                        <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
                    </div>
                )}
                <div className="w-full ">
                    <p>Email</p>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
                </div>

                {(state === "otp-verification" ||  state === "login") && (
                    <div className="w-full ">
                        <p>Password</p>
                        <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="password" required />
                    </div>
                )}

                 {state === "register" && (
                    <div className="w-full ">
                        <p>OTP </p>
                        <input onChange={(e) => setOtp(e.target.value)} value={otp} placeholder="OTP" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="number" required />
                    </div>
                )}
                
                {state === "otp-verification" ? (
                    <p>
                        Already have account? <span onClick={() => setState("login")} className="text-indigo-500 cursor-pointer">click here</span>
                    </p>
                ) : (
                    <p>
                        Create an account? <span onClick={() => setState("otp-verification")} className="text-primary cursor-pointer">click here</span>
                    </p>
                )}

                {state === "otp-verification" && (
                    <button onClick={() => sendOtp()} type='button' className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
                        Create Account
                    </button>
                )}
                
                {(state === "login" ||  state === "register") && (
                    <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
                        {state === "login" ? "Login" : "Verify OTP"}
                    </button>
                )}
            </form>
        </div>
    )
}

export default Login

