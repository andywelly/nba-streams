
import '@/app/globals.css';

export default async function RegisterPage() {
    return (
        <form className="flex flex-col gap-2 mx-auto max-w-md mt-10">
            <input className="border border-black" type="email"/>
            <input className="border border-black" type="password"/>
            <button type="submit">Register</button>
        </form>
    );
}