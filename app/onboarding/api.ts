export async function fetchCategories() {   
  const res = await fetch('http://localhost:8080/api/salons/service-categories');   
  return res.json(); 
}
export async function saveSalon(data: any) {
  const res = await fetch("http://localhost:8080/api/salons", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data),
  });
  return res.json();
}
export async function inviteEmployee(salonId: number, data: any, salonAdminEmail: string, salonName: string) {
  return fetch(`http://localhost:8080/api/salons/${salonId}/employees?salonAdminEmail=${encodeURIComponent(salonAdminEmail)}&salonName=${encodeURIComponent(salonName)}`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data),
  });
}