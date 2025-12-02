/**
 * @vitest-environment jsdom
 */



import { describe, test, expect,vi} from "vitest";
import {dades, registre,supaBase} from "./components/registre";

describe("Tests del joc de memoria", ()=>{
    describe("Funció de registre",()=>{//funcio de conexio a supabase
        test("ha de retornar un element HTML",()=>{
            expect(registre()).toBeInstanceOf(HTMLElement);
        });
        test("ha de redirigir-se a dades()", ()=>{

        });
    });

    describe("Funció per afegir els esdeveniments i enviar-ho a la funcio supaBase()",()=>{
        test("ha de retornar el email, contrasenya i contrasenya_repeat",()=>{
        
        });
        test("Ha d'enviar les dades del formulari a supabase",()=>{

        })
    });


    describe("Funció per guardar el email i el password en SupaBase",()=>{
        test("Ha d'enviar les dades ",()=>{

        })
    });
    



});