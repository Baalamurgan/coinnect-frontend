export async function POST() {
  try {
    await fetch(
      `${process.env.NEXT_PUBLIC_USER_SIDE}/api/revalidate/categories?secret=${process.env.REVALIDATE_SECRET}`,
      {
        method: 'POST'
      }
    );
    return new Response(JSON.stringify({ triggered: true }));
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ error: 'Failed to trigger' }), {
      status: 500
    });
  }
}
