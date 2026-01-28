import InfoContainer from '@/components/admin/layout/each-page-info-container'
import { ShoppingBag, Users, DollarSign, Package } from 'lucide-react'

const page = () => {
  return (
    <main>
      <section className='text-xl font-semibold text-center'>
        Admin Section
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoContainer
          name="Total Revenue"
          total="10,457,231"
          iconName="DollarSign"
          trend="+20.1%"
          color="green"
        />
        <InfoContainer
          name="Products"
          total={124}
          iconName="Package"
          color="blue"
        />
        <InfoContainer
          name="Total Orders"
          total={892}
          iconName='ShoppingBag'
          trend="+12%"
          color="purple"
        />
        <InfoContainer
          name="Customers"
          total={562}
          iconName='Users'
          color="orange"
        />
      </section>

    </main>
  )
}

export default page


// Inside your component:
