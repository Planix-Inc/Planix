const VerPerfil=()=>{
    const { id } = useParams();
    const [perfilEmpresas, setPerfilEmpresas] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchPerfil = async () => {
        const { data, error } = await supabase
          .from("Usuario")
          .select("*, tipoProfesional: idTipoProfesional (descripcion)")
          .eq("id", id)
          .single();
  
        if (error) {
          console.error("Error al obtener perfil:", error);
        } else {
            setPerfilEmpresas(data);
        }
        setLoading(false);
      };
  
      fetchPerfil();
    }, [id]);
  
    if (loading) {
      return <div>Cargando perfil...</div>;
    }
  
    if (!perfilEmpresas) {
      return <div>Perfil no encontrado.</div>;
    }
  
    return (
      <div className="perfil-container">
        <img src={perfilEmpresas.img} height="200"/>
        <h1>{perfilEmpresas.razonSocial}</h1>
        <p>Email: {perfilEmpresas.email}</p>
        <p>Localidad: {perfilEmpresas.localidad}</p>
        <p>Valoración: {perfilEmpresas.valoracion}</p>
        <p>Direccion:{perfilEmpresas.direccion}</p>
        <p>Email:{perfilEmpresas.Email}</p>
      </div>
    );
}
export default VerPerfil