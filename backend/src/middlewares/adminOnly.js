export default async function adminOnly(request, reply) {
  try {
    await request.jwtVerify();
    
    // Allow both super_admin and admin roles
    if (request.user.role !== 'admin' && request.user.role !== 'super_admin') {
      return reply.code(403).send({
        error: 'Forbidden',
        message: 'Admin access required',
      });
    }
  } catch (err) {
    return reply.code(401).send({
      error: 'Unauthorized',
      message: 'Authentication required',
    });
  }
}

