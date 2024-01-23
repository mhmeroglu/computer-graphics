# İrem Güngör & Mehmet Eroğlu
# ----------
    # TODO 5: FRESNEL
    #
    # In case we don't use fresnel, get reflectivity k_r directly using:
    reflectivity = mat.mirror_reflectivity
    # Otherwise, calculate k_r using Schlick’s approximation
    if mat.use_fresnel:
       # calculate R_0: R_0 = ((n1 - n2) / (n1 + n2))^2
        # Here n1 is the IOR of air, so n1 = 1
        # n2 is the IOR of the object, you can read it from the material property using: mat.ior
        n1 = 1.0
        n2 = mat.ior
        
        R_0 = ((n1 - n2) / (n1 + n2))**2
        
        cost = -ray_dir.dot(hit_norm)
        # 
        # Calculate reflectivity k_r = R_0 + (1 - R_0) (1 - cos(theta))^5 where theta is the incident angle.
        reflectivity = R_0 + (1 - R_0) * (1 - cost)**5
    #
    # Re-run this script, and render the scene to check your result with Checkpoint 5.
    # ----------

    # TODO 4: RECURSION AND REFLECTION
    # If the depth is greater than zero, generate a reflected ray from the current x
    # If the depth is greater than zero, generate a reflected ray from the current intersection point using the direction D_reflect to determine the color contribution L_reflect.  
    # Multiply L_reflect by the reflectivity k_r, and then combine the result with the pixel color.
    #
    # Similar to how we handle shadow ray casting, it's important to account for self-occlusion in this context as well.
    # Remember to update depth at the end!
    if depth > 0:
        # Get the direction for reflection ray
        # D_reflect = D - 2 (D dot N) N
        D_reflect = ray_dir - 2 * ray_dir.dot(hit_norm) * hit_norm
        
        # Recursively trace the reflected ray and store the return value as a color L_reflect
        C_reflect = RT_trace_ray(scene, hit_loc + (hit_norm *  0.001), D_reflect, lights, depth - 1)
            
        # Add reflection to the final color: k_r * L_reflect
        color += reflectivity * C_reflect
    #
    # Re-run this script, and render the scene to check your result with Checkpoint 4.
    # ----------

    # ----------
    # TODO 6: TRANSMISSION
    #
    # If the depth is greater than zero, generate a transmitted ray from the current 
    # point of intersection using the direction D_transmit to calculate the color contribution L_transmit. 
    # Multiply this by (1 - k_r) * mat.transmission, and then add the result into the pixel color.
    #
    # Ensure that the refractive indices (n1 and n2) are assigned based on the media through which the ray is passing (as specified by ray_inside_object)
    # Use the refractive index of the object (mat.ior) and set the refractive index of air as 1
   
    if mat.transmission > 0:
        if  ray_inside_object:
            n1 = mat.ior  
            n2 = 1.0  
        else:
            n1 = 1.0  
            n2 = mat.ior
        
        n_ratio = n1 / n2
        
        cos_theta = -ray_dir.dot(hit_norm)
        sin_theta = sqrt(1.0 - cos_theta**2)
        
        if n_ratio * sin_theta <= 1.0:
            term1 = n_ratio * (ray_dir + (hit_norm * cos_theta))
            term2 = hit_norm * sqrt(1 - (n_ratio * sin_theta)**2)
    
            D_transmit = term1 - term2
            
            
            C_transmit = RT_trace_ray(scene, hit_loc - hit_norm * 0.01, D_transmit, lights, depth - 1)
        
            color += (1 - reflectivity) * mat.transmission * C_transmit
    #
    # Re-run this script, and render the scene to check your result with Checkpoint 6.
    # ----------