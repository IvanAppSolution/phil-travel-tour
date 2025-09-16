## Travel Asia Booking Site

## Getting Started
First, run the development server:

```bash
npm run dev

```Auth
npm exec auth secret     

```Prisma
npx prisma migrate dev
npx prisma generate

```Add Shadcn ui components
pnpm dlx shadcn@latest add [component name]


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

```Business logic
Travel will main product. I has a trip like Cebu Tour, Manila Tour which has a list of trip like Island hopping, caving, city tour per day which consist of multiple location. An order can only have one travel which the trip has multiple dynamic selected trip.