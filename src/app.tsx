import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CreateTripPage } from "./pages/creat-trip";
import { TripDetailsPage } from "./pages/trip-details";

const router = createBrowserRouter([
  {
    path: "/", 
    element: <CreateTripPage />,
  },
  {
    path: "/trips/:tripId", 
    element: <TripDetailsPage />,
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
