import { Route, Routes } from "react-router-dom";
import useAuthUser from "./hooks/userHooks/useAuthUser"

export default function App() {
  // const { isLoading, authUser } = useAuthUser();
  // const isAuthenticated = Boolean(authUser);

  // if (!isLoading) {
  //   return <PageLoader />
  // }
  return (
    <div className='h-screen min-h-80 max-w-5xl'>
      <Routes>
        <Route path="/" element={} />
      </Routes>
    </div>
  )
}
