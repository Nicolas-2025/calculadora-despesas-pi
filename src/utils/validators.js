export function assertNonEmpty(value, msg){
  if(!value || String(value).trim()===''){
    const e = new Error(msg || 'Campo obrigatório');
    e.status = 400; throw e;
  }
}

export function httpError(res, err){
  const status = err.status || 500;
  res.status(status).json({ok:false, error: err.message || 'Erro interno'});
}
