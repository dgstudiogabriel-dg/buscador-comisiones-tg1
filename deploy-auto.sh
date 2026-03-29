#!/bin/bash

# 🚀 SCRIPT AUTOMÁTICO DE DEPLOYMENT
# Este script hace todo automáticamente: GitHub + Vercel
# Solo ejecuta: bash deploy-auto.sh

set -e  # Detener si hay error

echo "======================================"
echo "🚀 INICIANDO DEPLOYMENT AUTOMÁTICO"
echo "======================================"
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# PASO 1: Verificar que estamos en la carpeta correcta
echo -e "${BLUE}📁 PASO 1: Verificando carpeta...${NC}"
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: No estás en la carpeta correcta${NC}"
    echo "Navega a la carpeta del proyecto y vuelve a intentar"
    exit 1
fi
echo -e "${GREEN}✅ Carpeta correcta${NC}"
echo ""

# PASO 2: Configurar Git
echo -e "${BLUE}📝 PASO 2: Configurando Git${NC}"
git config user.name "Dgstudio" 2>/dev/null || true
git config user.email "dgstudio.gabriel@gmail.com" 2>/dev/null || true
echo -e "${GREEN}✅ Git configurado${NC}"
echo ""

# PASO 3: Agregar cambios y hacer commit
echo -e "${BLUE}📦 PASO 3: Preparando cambios...${NC}"
git add .
git commit -m "Actualización: Proyecto listo para producción" --allow-empty 2>/dev/null || true
echo -e "${GREEN}✅ Cambios preparados${NC}"
echo ""

# PASO 4: Push a GitHub
echo -e "${BLUE}🌐 PASO 4: Subiendo código a GitHub...${NC}"
echo "Esto puede tardar unos segundos..."
if git push origin main 2>&1; then
    echo -e "${GREEN}✅ Código en GitHub${NC}"
else
    echo -e "${YELLOW}⚠️  No se pudo conectar a GitHub (revisar conexión de internet)${NC}"
    echo "Intenta ejecutar manualmente: git push origin main"
    exit 1
fi
echo ""

# PASO 5: Instalar Vercel CLI
echo -e "${BLUE}⚙️  PASO 5: Instalando Vercel CLI${NC}"
if command -v vercel &> /dev/null; then
    echo -e "${GREEN}✅ Vercel CLI ya existe${NC}"
else
    echo "Instalando vercel..."
    npm install -g vercel || {
        echo -e "${YELLOW}⚠️  npm tiene restricciones. Intenta instalar manualmente:${NC}"
        echo "npm install -g vercel"
        exit 1
    }
fi
echo ""

# PASO 6: Deploy a Vercel
echo -e "${BLUE}🚀 PASO 6: Desplegando a Vercel...${NC}"
echo "Esto puede tardar 1-2 minutos..."
VERCEL_TOKEN=$(grep VERCEL_TOKEN .env.local | cut -d'=' -f2)
if vercel --prod --yes --token "$VERCEL_TOKEN"; then
    echo -e "${GREEN}✅ ¡Deployment a Vercel completado!${NC}"
else
    echo -e "${YELLOW}⚠️  Error en deployment${NC}"
    echo "Asegúrate de tener token válido en .env.local"
    exit 1
fi
echo ""

# Resumen final
echo "======================================"
echo -e "${GREEN}✅ DEPLOYMENT COMPLETADO${NC}"
echo "======================================"
echo ""
echo -e "${GREEN}Tu aplicación está en:${NC}"
echo "🔗 https://buscador-comisiones-tg1.vercel.app"
echo ""
echo -e "${GREEN}Repositorio en:${NC