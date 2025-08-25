import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import type {ReactNode} from "react";

export default function DefaultLayout({ children }: { children: ReactNode }) {
    return (
        <div className="d-flex flex-column min-vh-100">
            <NavBar/>
            <main className="flex-fill px-4 py-4 mt-5">{children}</main>
            <Footer/>
        </div>
    );
}