module.exports=[37936,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"registerServerReference",{enumerable:!0,get:function(){return d.registerServerReference}});let d=a.r(11857)},13095,(a,b,c)=>{"use strict";function d(a){for(let b=0;b<a.length;b++){let c=a[b];if("function"!=typeof c)throw Object.defineProperty(Error(`A "use server" file can only export async functions, found ${typeof c}.
Read more: https://nextjs.org/docs/messages/invalid-use-server-value`),"__NEXT_ERROR_CODE",{value:"E352",enumerable:!1,configurable:!0})}}Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"ensureServerEntryExports",{enumerable:!0,get:function(){return d}})},98251,a=>{"use strict";var b=a.i(37936),c=a.i(98310),d=a.i(18558),e=a.i(83111),f=a.i(13095);let g=e.z.object({patient_id:e.z.string().uuid(),vaccine_name:e.z.string().min(1,"Vaccine name is required"),date_administered:e.z.string().min(1,"Date administered is required"),date_next_due:e.z.string().optional()});async function h(){let a=await (0,c.createClient)(),{data:b,error:d}=await a.from("vaccinations").select(`
      *,
      patients (
        name,
        species,
        clients (
          first_name,
          last_name
        )
      )
    `).order("date_administered",{ascending:!1});if(d)throw Error(d.message);return b}async function i(a,b){let e={patient_id:b.get("patient_id"),vaccine_name:b.get("vaccine_name"),date_administered:b.get("date_administered"),date_next_due:b.get("date_next_due")||null},f=g.safeParse(e);if(!f.success)return{error:f.error.flatten().fieldErrors};let h=await (0,c.createClient)(),{error:i}=await h.from("vaccinations").insert(f.data);return i?{error:i.message}:((0,d.revalidatePath)("/dashboard/vaccinations"),{success:!0})}(0,f.ensureServerEntryExports)([h,i]),(0,b.registerServerReference)(h,"0045b3ff0b13036bab5c1129e9492786d6a1a33c86",null),(0,b.registerServerReference)(i,"60d9778bbaae58a16e92f122e1cc8bb1b09d740526",null),a.s(["createVaccinationAction",()=>i,"getVaccinations",()=>h])},12141,a=>{"use strict";var b=a.i(98251);a.s([],74438),a.i(74438),a.s(["0045b3ff0b13036bab5c1129e9492786d6a1a33c86",()=>b.getVaccinations,"60d9778bbaae58a16e92f122e1cc8bb1b09d740526",()=>b.createVaccinationAction],12141)}];

//# sourceMappingURL=_3817755f._.js.map