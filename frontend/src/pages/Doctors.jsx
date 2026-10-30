import { useContext, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AppContext } from "../context/AppContext"

const Doctors = () => {
  const { speciality } = useParams()
  const navigate = useNavigate()

  const [showFilter, setShowFilter] = useState(false)

  const { doctors } = useContext(AppContext)
  const filterDoc = speciality
    ? doctors.filter((doc) => doc.speciality === speciality)
    : doctors

  const specialities = [
    "General physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatricians",
    "Neurologist",
    "Gastroenterologist"
  ]

  return (
    <div>
      <p className="text-gray-600">
        Browse through the doctors specialist.
      </p>

      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
      <button  className={`py-1 px-3 border rounded text-sm transition-all sm:hidden  ${showFilter? 'bg-primary text-white':''}`} onClick={()=>setShowFilter(prev=>!prev)}>Filters</button>
        {/* Speciality List */}
        <div className={` flex-col gap-4 text-sm text-gray-600 ${showFilter?'flex': 'hidden sm:flex'}`}>

          {specialities.map((item, index) => (
            <p
              key={index}
              onClick={() => navigate(`/doctors/${item}`)}
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
                speciality === item
                  ? "bg-blue-100 text-blue-600 border-blue-400"
                  : ""
              }`}
            >
              {item}
            </p>
          ))}

        </div>

        {/* Doctors Grid */}
        <div className="w-full grid grid-cols-auto gap-4 gap-y-6">

          {filterDoc.map((item, index) => (
            <div
              onClick={() => navigate(`/appointments/${item._id}`)}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-1 transition-all duration-500"
              key={index}
            >
              <img
                className="bg-blue-50 w-full"
                src={item.image}
                alt={item.name}
              />

              <div className="p-4">

                <div className="flex items-center gap-2 text-sm text-green-500">
                  <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                  <p>Available</p>
                </div>

                <p className="text-gray-900 text-lg font-medium">
                  {item.name}
                </p>

                <p className="text-gray-600 text-sm">
                  {item.speciality}
                </p>

              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  )
}

export default Doctors