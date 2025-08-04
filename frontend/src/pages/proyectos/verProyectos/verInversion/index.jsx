import React, { useEffect, useState } from "react";
import { supabase } from "../../data/supabaseClient";
import { useNavigate } from "react-router-dom";

FormularioInversion=()=>{

return(
<form>
<div>
<p>Clave fiscal</p>
<input type="text"/>
</div>
<div>
<p>CUIT/CUIL</p>
<input type="text" />
</div>
<div>
<p>Domicilio fiscal</p>
<input type="text" />
</div>
<div>
<p>Ingresos anuales</p>
<input type="text" />
</div>
<div>
<p>Telefono</p>
<input type="tel"/>
</div>
<div>
<p>Monto estimado a invertir</p>
<select name="Monto">
<option value="">100.000</option>
<option value="">500.000</option>
<option value="">1.000.000</option>
<option value="">1.500.000</option>
<option value="">2.000.000</option>
</select>
<select name="Moneda">
<option value="">Peso Ars</option>
<option value="">Dolar U$S</option>
</select>
</div>
<div>
<button className="Cancelar">Cancelar</button>   
</div>
<div>
<button className="Listo">Listo</button>
</div>
</form>
)
}