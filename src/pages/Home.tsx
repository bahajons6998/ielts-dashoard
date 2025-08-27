import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="p-5">
            <h1>Home</h1>
            <p>Welcome to my website!</p>
            <div style={{display:'flex', margin:'0 auto', flexDirection:'column'}}>
                <Link to={'/reading'}>Reading</Link>
                <Link to={'/api/login'}>Login</Link>
                <Link to={'/api/register'}>Register</Link>
                <Link to={'/admin/v1/ielts'}>Dashboard</Link>
                <Link to={'/admin/v1/users'}>Users</Link>
            </div>
        </div>
    );
}