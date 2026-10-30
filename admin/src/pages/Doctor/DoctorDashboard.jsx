
import { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';

const DoctorDashboard = () => {
  const { dToken, getDashData, dashData } =
    useContext(DoctorContext);

  const { currency, slotDateFormat } =
    useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);

  if (!dashData) {
    return <p className="m-5">Loading dashboard...</p>;
  }

  return (
    <div className="m-5">
      {/* Dashboard statistics */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100">
          <img
            className="w-14"
            src={assets.earning_icon}
            alt="Earnings"
          />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {currency}{dashData.earning}
            </p>
            <p className="text-gray-400">Earnings</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100">
          <img
            className="w-14"
            src={assets.appointments_icon}
            alt="Appointments"
          />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {dashData.appointments}
            </p>
            <p className="text-gray-400">Appointments</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100">
          <img
            className="w-14"
            src={assets.patients_icon}
            alt="Patients"
          />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {dashData.patients}
            </p>
            <p className="text-gray-400">Patients</p>
          </div>
        </div>
      </div>

      {/* Latest bookings */}
      <div className="bg-white mt-10">
        <div className="flex items-center gap-2.5 px-4 py-4 rounded-t border">
          <img src={assets.list_icon} alt="Bookings" />
          <p className="font-semibold">Latest Bookings</p>
        </div>

        <div className="border border-t-0">
          {dashData.latestAppointments?.length > 0 ? (
            dashData.latestAppointments.map((item, index) => (
              <div
                key={item._id || index}
                className="flex items-center gap-3 px-4 py-3 border-b"
              >
                <img
                  className="w-12 h-12 object-cover rounded-full"
                  src={item.docData?.image || assets.profile_pic}
                  alt={item.docData?.name || 'Doctor'}
                />

                <div className="flex-1 text-sm">
                  <p className="text-gray-800 font-medium">
                    {item.docData?.name || 'Doctor'}
                  </p>

                  <p className="text-gray-500">
                    {item.slotDate
                      ? slotDateFormat(item.slotDate)
                      : 'Date unavailable'}
                  </p>
                </div>

                {item.cancelled ? (
                  <p className="text-red-400 text-xs font-medium">
                    Cancelled
                  </p>
                ) : (
                  <img
                    className="w-6"
                    src={assets.cancel_icon}
                    alt="Appointment not cancelled"
                  />
                )}
              </div>
            ))
          ) : (
            <p className="p-4 text-gray-500">
              No appointments found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
