export const initialInvoices = [
  { id:'INV-2026-1048', customer:'Mlimani Construction Ltd', warehouse:'Arusha Main', date:'2026-10-30', dueDate:'2026-11-02', registeredBy:'Amina Juma', status:'Partially Delivered', items:[{name:'Cement 42.5N',unit:'Bags',qty:300,delivered:180},{name:'Y12 Reinforcement Bar',unit:'Pieces',qty:120,delivered:60},{name:'Binding Wire',unit:'Rolls',qty:20,delivered:20}] },
  { id:'INV-2026-1047', customer:'Kilimanjaro Builders', warehouse:'Moshi Depot', date:'2026-10-30', dueDate:'2026-11-04', registeredBy:'Peter Mushi', status:'Pending', items:[{name:'Cement 32.5N',unit:'Bags',qty:450,delivered:0},{name:'Roofing Sheets Gauge 28',unit:'Pieces',qty:80,delivered:0}] },
  { id:'INV-2026-1046', customer:'Amani Estates', warehouse:'Arusha Main', date:'2026-10-29', dueDate:'2026-10-31', registeredBy:'Neema Paulo', status:'Fully Delivered', items:[{name:'Cement 42.5N',unit:'Bags',qty:200,delivered:200},{name:'Sand',unit:'Tonnes',qty:12,delivered:12}] },
  { id:'INV-2026-1045', customer:'Northern Roads Co.', warehouse:'Tanga Branch', date:'2026-10-28', dueDate:'2026-10-31', registeredBy:'John Mrema', status:'Pending', items:[{name:'Crushed Aggregate',unit:'Tonnes',qty:35,delivered:0},{name:'Cement 42.5N',unit:'Bags',qty:150,delivered:0}] },
  { id:'INV-2026-1044', customer:'Upendo Hardware', warehouse:'Moshi Depot', date:'2026-10-27', dueDate:'2026-10-29', registeredBy:'Amina Juma', status:'Partially Delivered', items:[{name:'PVC Pipe 4 inch',unit:'Lengths',qty:60,delivered:35},{name:'PVC Elbow 4 inch',unit:'Pieces',qty:40,delivered:15}] },
  { id:'INV-2026-1043', customer:'Meru Valley Projects', warehouse:'Arusha Main', date:'2026-10-26', dueDate:'2026-10-28', registeredBy:'Peter Mushi', status:'Fully Delivered', items:[{name:'Y16 Reinforcement Bar',unit:'Pieces',qty:90,delivered:90}] },
  { id:'INV-2026-1042', customer:'Jitegemee Contractors', warehouse:'Tanga Branch', date:'2026-10-25', dueDate:'2026-10-28', registeredBy:'John Mrema', status:'Pending', items:[{name:'Cement 32.5N',unit:'Bags',qty:240,delivered:0},{name:'Binding Wire',unit:'Rolls',qty:12,delivered:0}] }
];

export const users = [
  { email:'admin@bulktrack.co.tz', password:'123@', name:'Bakari Kihamia', role:'Admin / CEO', warehouse:'All warehouses', initials:'BK' },
  { email:'manager@bulktrack.co.tz', password:'123@', name:'Amina Juma', role:'Branch Manager', warehouse:'Arusha Main', initials:'AJ' },
  { email:'storekeeper@bulktrack.co.tz', password:'123@', name:'Peter Mushi', role:'Storekeeper', warehouse:'Arusha Main', initials:'PM' }
];
