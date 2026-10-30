import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
  return (
   <div
  id="speciality"
  className="flex flex-col items-center py-16 text-gray-800"
>
  <h1 className="text-3xl font-medium">
    Find by Speciality
  </h1>

  <p className="sm:w-1/3 text-center text-sm">
    Simply browse through our extensive list of trusted doctors, schedule
    <br className="hidden sm:block" />
    your appointment hassle-free.
  </p>

  <div className="flex flex-row flex-wrap items-center justify-center gap-4 pt-5">
    {specialityData.map((item, index) => (
      <Link onClick={()=>scrollTo(0,0)}
        className="flex flex-col items-center text-xs cursor-pointer shrink-0 hover:-translate-y-2 transition-all duration-500"
        key={index}
        to={`/doctors/${item.speciality}`}
      >
        <img
          className="w-16 sm:w-24 mb-2"
          src={item.image}
          alt=""
        />

        <p>{item.speciality}</p>
      </Link>
    ))}
  </div>
</div>
  )
}

export default SpecialityMenu