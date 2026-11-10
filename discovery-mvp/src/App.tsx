import { Routes, Route } from "react-router-dom";
import { Layout } from "./app/Layout";
import { Home } from "./pages/Home";
import { Results } from "./pages/Results";
import { ProviderProfile } from "./pages/ProviderProfile";
import { ListBusiness } from "./pages/ListBusiness";
import { Correction } from "./pages/Correction";
import { Styleguide } from "./pages/Styleguide";
import { NotFound } from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="results" element={<Results />} />
        <Route path="provider/:id" element={<ProviderProfile />} />
        <Route path="list-business" element={<ListBusiness />} />
        <Route path="correction" element={<Correction />} />
        <Route path="styleguide" element={<Styleguide />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
