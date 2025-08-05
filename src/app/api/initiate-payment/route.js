import { supabase } from "../../../utils/supabase/supaClient";

export async function POST(req) {
  const body = await req.json();

  const { full_name, email, phone, permit_type } = body;

  const { data, error } = await supabase
    .from("permits")
    .insert([{ full_name, email, phone, permit_type, status: "pending" }])
    .select();

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }

  // Optionally create Paystack link and return that as well (next step)
  return new Response(JSON.stringify({ permit: data[0] }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
