"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, Globe, Eye, Upload, Image as ImageIcon } from "lucide-react";
import { saveSection, publishLanding, uploadAsset, type LandingSection } from "../actions";

type CMSEditorProps = {
    pageId: string;
    initialSections: LandingSection[];
};

export function CMSEditor({ pageId, initialSections }: CMSEditorProps) {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Helpers to get content safely
    const getSectionContent = (key: string) => initialSections.find(s => s.key === key)?.content || {};

    const [data, setData] = useState({
        hero: getSectionContent('hero'),
        services: getSectionContent('services'),
        contact: getSectionContent('contact'),
        branding: getSectionContent('branding'),
        footer: getSectionContent('footer'),
    });

    const updateSection = (section: keyof typeof data, newData: any) => {
        setData(prev => ({ ...prev, [section]: newData }));
    };

    const handleSave = async (key: string, sectionData: any) => {
        setLoading(true);
        try {
            await saveSection(pageId, key, sectionData);
            toast.success(`Sección ${key} guardada`);
        } catch (error) {
            toast.error("Error al guardar");
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async () => {
        setLoading(true);
        try {
            await publishLanding(pageId);
            toast.success("Landing publicada exitosamente");
        } catch (error) {
            toast.error("Error al publicar");
        } finally {
            setLoading(false);
        }
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', e.target.files[0]);

            const publicUrl = await uploadAsset(formData);
            updateSection('branding', { ...data.branding, logoUrl: publicUrl });
            toast.success("Logo subido correctamente");
        } catch (error: any) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : "Error al subir imagen");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm sticky top-4 z-20">
                <div>
                    <h3 className="text-lg font-medium">Editor de Landing</h3>
                    <p className="text-sm text-muted-foreground">Estado: Draft</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" /> Preview
                    </Button>
                    <Button onClick={handlePublish} disabled={loading} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Globe className="w-4 h-4 mr-2" /> Publicar
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="hero" className="w-full">
                <TabsList className="grid w-full grid-cols-6 lg:w-[800px]">
                    <TabsTrigger value="branding">Marca</TabsTrigger>
                    <TabsTrigger value="hero">Hero</TabsTrigger>
                    <TabsTrigger value="services">Servicios</TabsTrigger>
                    <TabsTrigger value="contact">Contacto</TabsTrigger>
                    <TabsTrigger value="footer">Footer</TabsTrigger>
                    <TabsTrigger value="features">Otros</TabsTrigger>
                </TabsList>

                {/* BRANDING EDITOR */}
                <TabsContent value="branding">
                    <Card>
                        <CardHeader>
                            <CardTitle>Identidad de Marca</CardTitle>
                            <CardDescription>Personaliza completamente la apariencia de tu sitio.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            {/* Logo Upload */}
                            <div className="grid gap-2">
                                <Label>Logotipo</Label>
                                <div className="flex items-start gap-4">
                                    <div className="h-24 w-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden relative">
                                        {data.branding?.logoUrl ? (
                                            <img src={data.branding.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                                        ) : (
                                            <ImageIcon className="text-gray-400 w-8 h-8" />
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <div className="relative">
                                            <Input
                                                type="file"
                                                className="hidden"
                                                id="logo-upload"
                                                accept="image/*"
                                                onChange={handleLogoUpload}
                                                disabled={uploading}
                                            />
                                            <Button variant="outline" size="sm" onClick={() => document.getElementById('logo-upload')?.click()} disabled={uploading}>
                                                <Upload className="w-4 h-4 mr-2" />
                                                {uploading ? "Subiendo..." : "Subir Imagen"}
                                            </Button>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Recomendado: 200x200px PNG transparente.
                                            <div className="mt-1">
                                                <Label className="text-xs font-normal">Texto del Logo (Alternativo):</Label>
                                                <Input
                                                    className="h-8 mt-1 w-48"
                                                    value={data.branding?.logoText || ''}
                                                    onChange={(e) => updateSection('branding', { ...data.branding, logoText: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Colors */}
                            <div className="grid gap-4">
                                <Label>Color Primario</Label>
                                <div className="flex flex-wrap gap-3 items-center">
                                    {/* Presets */}
                                    {['violet', 'emerald', 'blue', 'rose', 'orange', 'cyan'].map((color) => (
                                        <div
                                            key={color}
                                            onClick={() => updateSection('branding', { ...data.branding, primaryColor: color })}
                                            className={`w-10 h-10 rounded-full cursor-pointer border-2 transition-transform hover:scale-110 flex items-center justify-center ${data.branding?.primaryColor === color ? 'border-gray-900 ring-2 ring-offset-2 ring-gray-300' : 'border-transparent'}`}
                                            title={color}
                                        >
                                            <div className={`w-full h-full rounded-full`} style={{ backgroundColor: `var(--color-${color}-500, ${color === 'violet' ? '#8b5cf6' : color === 'emerald' ? '#10b981' : color === 'blue' ? '#3b82f6' : color === 'rose' ? '#f43f5e' : color === 'orange' ? '#f97316' : '#06b6d4'})` }}></div>
                                        </div>
                                    ))}

                                    <div className="w-px h-8 bg-gray-200 mx-2"></div>

                                    {/* Custom Color Picker */}
                                    <div className="flex items-center gap-2">
                                        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm transition-transform hover:scale-110">
                                            <Input
                                                type="color"
                                                className="absolute inset-0 w-20 h-20 -top-5 -left-5 p-0 border-none cursor-pointer"
                                                value={data.branding?.primaryColor?.startsWith('#') ? data.branding.primaryColor : '#000000'}
                                                onChange={(e) => updateSection('branding', { ...data.branding, primaryColor: e.target.value })}
                                            />
                                        </div>
                                        <span className="text-xs text-muted-foreground uppercase font-mono">
                                            {data.branding?.primaryColor?.startsWith('#') ? data.branding.primaryColor : 'Custom'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Button onClick={() => handleSave('branding', data.branding)} disabled={loading}>
                                <Save className="w-4 h-4 mr-2" /> Guardar Marca
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* HERO EDITOR */}
                <TabsContent value="hero">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sección Hero</CardTitle>
                            <CardDescription>Lo primero que ven tus clientes.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Título Principal</Label>
                                <Input
                                    value={data.hero?.title || ''}
                                    onChange={(e) => updateSection('hero', { ...data.hero, title: e.target.value })}
                                    placeholder="Ej: Cuidado Veterinario de Excelencia"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Subtítulo</Label>
                                <Textarea
                                    value={data.hero?.subtitle || ''}
                                    onChange={(e) => updateSection('hero', { ...data.hero, subtitle: e.target.value })}
                                    placeholder="Descripción corta..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Texto Botón Primario</Label>
                                    <Input
                                        value={data.hero?.cta_primary || ''}
                                        onChange={(e) => updateSection('hero', { ...data.hero, cta_primary: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Texto Botón Secundario</Label>
                                    <Input
                                        value={data.hero?.cta_secondary || ''}
                                        onChange={(e) => updateSection('hero', { ...data.hero, cta_secondary: e.target.value })}
                                    />
                                </div>
                            </div>
                            <Button onClick={() => handleSave('hero', data.hero)} disabled={loading}>
                                <Save className="w-4 h-4 mr-2" /> Guardar Hero
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SERVICES EDITOR */}
                <TabsContent value="services">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sección de Servicios</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Título de Sección</Label>
                                <Input
                                    value={data.services?.title || ''}
                                    onChange={(e) => updateSection('services', { ...data.services, title: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Descripción</Label>
                                <Textarea
                                    value={data.services?.subtitle || ''}
                                    onChange={(e) => updateSection('services', { ...data.services, subtitle: e.target.value })}
                                />
                            </div>
                            <Button onClick={() => handleSave('services', data.services)} disabled={loading}>
                                <Save className="w-4 h-4 mr-2" /> Guardar Servicios
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* CONTACT EDITOR */}
                <TabsContent value="contact">
                    <Card>
                        <CardHeader>
                            <CardTitle>Información de Contacto</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Dirección</Label>
                                <Input
                                    value={data.contact?.address || ''}
                                    onChange={(e) => updateSection('contact', { ...data.contact, address: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Teléfono</Label>
                                <Input
                                    value={data.contact?.phone || ''}
                                    onChange={(e) => updateSection('contact', { ...data.contact, phone: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Horario</Label>
                                <Textarea
                                    value={data.contact?.hours || ''}
                                    onChange={(e) => updateSection('contact', { ...data.contact, hours: e.target.value })}
                                    placeholder="Ej: Lun-Vie: 9am - 8pm"
                                />
                                <p className="text-xs text-muted-foreground">Este horario se muestra también en el banner superior.</p>
                            </div>
                            <Button onClick={() => handleSave('contact', data.contact)} disabled={loading}>
                                <Save className="w-4 h-4 mr-2" /> Guardar Contacto
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* FOOTER EDITOR */}
                <TabsContent value="footer">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pie de Página (Footer)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Texto Copyright</Label>
                                <Input
                                    value={data.footer?.copyright || ''}
                                    onChange={(e) => updateSection('footer', { ...data.footer, copyright: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Links de Redes Sociales</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    <Input
                                        placeholder="Facebook URL"
                                        value={data.footer?.social?.facebook || ''}
                                        onChange={(e) => updateSection('footer', { ...data.footer, social: { ...data.footer.social, facebook: e.target.value } })}
                                    />
                                    <Input
                                        placeholder="Instagram URL"
                                        value={data.footer?.social?.instagram || ''}
                                        onChange={(e) => updateSection('footer', { ...data.footer, social: { ...data.footer.social, instagram: e.target.value } })}
                                    />
                                    <Input
                                        placeholder="Twitter/X URL"
                                        value={data.footer?.social?.twitter || ''}
                                        onChange={(e) => updateSection('footer', { ...data.footer, social: { ...data.footer.social, twitter: e.target.value } })}
                                    />
                                </div>
                            </div>
                            <Button onClick={() => handleSave('footer', data.footer)} disabled={loading}>
                                <Save className="w-4 h-4 mr-2" /> Guardar Footer
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="features">
                    <Card>
                        <CardHeader>
                            <CardTitle>Features</CardTitle>
                            <CardDescription>Para este MVP, configurar via JSON manual si es necesario.</CardDescription>
                        </CardHeader>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    );
}
