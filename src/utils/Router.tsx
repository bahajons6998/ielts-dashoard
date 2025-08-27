import React from "react";
import { Routes, Route } from "react-router-dom";

// pages
import Home from "@/pages/Home";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";

// components
// import Reading from "@/components/reading/Reading";
// import Writing from "@/components/writing/Writing";
// import Listening from "@/components/listening/Listening";
// import Register from "@/components/auth/Register";
// import Login from "@/components/auth/Login";

// admin
import IeltsContent from "@/admin/ielts/IeltsContent";
import IeltsSingle from "@/admin/ielts/IeltsSingle";
import Users from "@/admin/users/Users";
import ReadingText from "@/admin/reading/ReadingText";
import ListeningPart from "@/admin/listening/ListeningPart";
import UserResult from "@/admin/users/UserResult";
import UserWritingResult from "@/admin/users/UserWritingResult";

function Router() {
	return (
		<Routes>
			{/* public routes */}
			<Route path="/" element={<Home />} />
			<Route path="/about" element={<About />} />
			<Route path="/contact" element={<Contact />} />

			{/* auth */}
			{/* <Route path="/api/login" element={<Login />} />
			<Route path="/api/register" element={<Register />} /> */}

			{/* ielts parts */}
			{/* <Route path="/reading/:part/:number" element={<Reading />} /> */}
			{/* <Route path="/writing" element={<Writing />} /> */}
			{/* <Route path="/listening" element={<Listening />} /> */}

			{/* admin */}
			<Route path="/admin/v1/users" element={<Users />} />
			<Route path="/admin/v1/users/result/:userId" element={<UserResult />} />
			<Route path="/admin/v1/users/result/writing/:test_id/:user_id" element={<UserWritingResult />} />
			<Route path="/admin/v1/ielts" element={<IeltsContent />} />
			<Route path="/admin/v1/ielts/:id" element={<IeltsSingle />} />
			<Route path="/admin/v1/ielts/:id/reading/:reading_id" element={<ReadingText />} />
			<Route path="/admin/v1/ielts/:id/listening/:listening_id" element={<ListeningPart />} />

			{/* fallback */}
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}

export default Router;

