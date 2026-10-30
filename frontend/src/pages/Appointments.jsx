import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { useContext, useMemo, useState } from "react";
import { assets } from "../assets/assets";
import TopDoctors from "../Components/TopDoctors";
import axios from "axios";
import { toast } from "react-toastify";

const Appointments = () => {
  const { docId } = useParams();

  const { doctors, currencySymbol,backendUrl,token, getDoctorsData } = useContext(AppContext);

  const docInfo = doctors.find((doc) => doc._id === String(docId)) || null;
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const navigate=useNavigate()

  const docSlots = useMemo(() => {
    if (!docInfo) return [];

    const today = new Date();
    const slots = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const endTime = new Date(today);
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      if (i === 0) {
        const currentHour = currentDate.getHours();
        if (currentHour >= 10) {
          currentDate.setHours(currentHour + 1, 0, 0, 0);
        } else {
          currentDate.setHours(10, 0, 0, 0);
        }
      } else {
        currentDate.setHours(10, 0, 0, 0);
      }

      currentDate.setSeconds(0);
      currentDate.setMilliseconds(0);

      const timeSlots = [];

      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        const slotDate = `${day}_${month}_${year}`;
        const bookedSlots = docInfo.slots_booked || {};
        const isSlotAvailable = !(bookedSlots[slotDate] && bookedSlots[slotDate].includes(formattedTime));

        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      slots.push(timeSlots);
    }

    return slots;
  }, [docInfo]);

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate("/login");
    }

    if (!slotTime) {
      toast.warn("Please select a time slot");
      return;
    }

    try {
      const selectedDate = docSlots[slotIndex]?.[0]?.datetime;
      if (!selectedDate) {
        toast.error("Please select a valid date");
        return;
      }

      const date = new Date(selectedDate);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const slotDate = `${day}_${month}_${year}`;

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    docInfo && (
      <div>

        {/* ---------------- Doctor Details ---------------- */}

        <div className="flex flex-col sm:flex-row gap-4">

          {/* Doctor Image */}
          <div>
            <img
              className="bg-primary w-full sm:max-w-72 rounded-lg"
              src={docInfo.image}
              alt=""
            />
          </div>

          {/* Doctor Information */}
          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white sm:mx-0 -mt-20 sm:mt-0">

            {/* Doctor Name */}
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name}

              <img
                className="w-5"
                src={assets.verified_icon}
                alt=""
              />
            </p>

            {/* Degree and speciality */}
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>

              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docInfo.experience}
              </button>
            </div>

            {/* About Doctor */}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About

                <img
                  className="w-4"
                  src={assets.info_icon}
                  alt=""
                />
              </p>

              <p className="text-sm text-gray-500 max-w-175 mt-1">
                {docInfo.about}
              </p>
            </div>

            {/* Appointment Fee */}
            <p className="text-gray-500 font-medium mt-4">
              Appointment fee:

              <span className="text-gray-600">
                {currencySymbol}
                {docInfo.fees}
              </span>
            </p>
          </div>
        </div>


        {/* ---------------- Booking Slots ---------------- */}

        <div className="sm:ml-72 sm:pl-4 mt-6 font-medium text-gray-700">

          <p>Booking slots</p>

          {/* Date Slots */}
          <div className="flex gap-3 items-center w-full overflow-x-auto mt-4">

            {docSlots.length > 0 &&
              docSlots.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSlotIndex(index);
                    setSlotTime("");
                  }}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index
                      ? "bg-primary text-white"
                      : "border border-gray-200"
                  }`}
                >
                  <p>
                    {item[0] &&
                      item[0].datetime.toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                        }
                      )}
                  </p>

                  <p>
                    {item[0] &&
                      item[0].datetime.getDate()}
                  </p>
                </div>
              ))}
          </div>


          {/* Time Slots */}
          <div className="flex items-center gap-3 w-full overflow-x-auto mt-4">

            {docSlots.length > 0 &&
              docSlots[slotIndex]?.map((item, index) => (
                <p
                  key={index}
                  onClick={() => setSlotTime(item.time)}
                  className={`text-sm font-light shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    slotTime === item.time
                      ? "bg-primary text-white"
                      : "text-gray-400 border border-gray-300"
                  }`}
                >
                  {item.time}
                </p>
              ))}
          </div>


          {/* Book Appointment Button */}
          <button onClick={bookAppointment}
            className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6"
          >
            Book an appointment
          </button>

        </div>


        {/* ---------------- Top Doctors ---------------- */}

        <div className="mt-16">
          <TopDoctors />
        </div>

      </div>
    )
  );
};

export default Appointments;