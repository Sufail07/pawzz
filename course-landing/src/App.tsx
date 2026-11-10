import { Routes, Route } from "react-router-dom";
import { Layout } from "./app/Layout";
import { Home } from "./pages/Home";
import { Privacy } from "./pages/Privacy";
import { Styleguide } from "./pages/Styleguide";
import { NotFound } from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="styleguide" element={<Styleguide />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
