class Mth {
    static clamp(v, min, max) {
        return Math.min(Math.max(v, min), max);
    }
    
    static lerp(v, v1, v2) {
        return v1 + v * (v2 - v1);
    }
    
    static lerpVec3(v, vec1, vec2) {
        return Vec3.of(Mth.lerp(v, vec1.getX(), vec2.getX()), Mth.lerp(v, vec1.getY(), vec2.getY()), Mth.lerp(v, vec1.getZ(), vec2.getZ()));
    }

    static minAbs(v1, v2) {
        return Math.abs(v1) <= Math.abs(v2) ? v1 : v2;
    }
}