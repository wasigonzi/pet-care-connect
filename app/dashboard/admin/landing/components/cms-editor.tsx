"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, Globe, Eye } from "lucide-react";
import { saveSection, publishLanding, type LandingSection } from "../actions";

const heroSchema = z.object({
    title: z.string().min(1),
    subtitle: z.string(),
    cta_primary: z.string(),
    cta_secondary: z.string(),
});

const servicesSchema = z.object({
    title: z.string(),
    subtitle: z.string(),
});

type CMSEditorProps = {
    pageId: string;
    initialSections: LandingSection[];
};

export function CMSEditor({ pageId, initialSections }: CMSEditorProps) {
    const [loading, setLoading] = useState(false);

    // Helpers to get content safely
    const getSectionContent = (key: string) => initialSections.find(s => s.key === key)?.content || {};

    // Forms
    // In a full app, these would be separate sub-components to handle complexity
    // For MVP, we manage state here or utilize RHF for each section

    // --- Hero State ---
    const [heroData, setHeroData] = useState(getSectionContent('hero'));
    // --- Services State ---
    const [servicesData, setServicesData] = useState(getSectionContent('services'));
    // --- Contact/Footer State ---
    const [contactData, setContactData] = useState(getSectionContent('contact'));

    const handleSave = async (key: string, data: any) => {
        setLoading(true);
        try {
            await saveSection(pageId, key, data);
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
                <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
                    <TabsTrigger value="hero">Hero</TabsTrigger>
                    <TabsTrigger value="services">Servicios</TabsTrigger>
                    <TabsTrigger value="contact">Contacto</TabsTrigger>
                    <TabsTrigger value="features">Features</TabsTrigger>
                </TabsList>

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
                                    value={heroData.title || ''}
                                    onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                                    placeholder="Ej: Cuidado Veterinario de Excelencia"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Subtítulo</Label>
                                <Textarea
                                    value={heroData.subtitle || ''}
                                    onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                                    placeholder="Descripción corta..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Texto Botón Primario</Label>
                                    <Input
                                        value={heroData.cta_primary || ''}
                                        onChange={(e) => setHeroData({ ...heroData, cta_primary: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Texto Botón Secundario</Label>
                                    <Input
                                        value={heroData.cta_secondary || ''}
                                        onChange={(e) => setHeroData({ ...heroData, cta_secondary: e.target.value })}
                                    />
                                </div>
                            </div>
                            <Button onClick={() => handleSave('hero', heroData)} disabled={loading}>
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
                                    value={servicesData.title || ''}
                                    onChange={(e) => setServicesData({ ...servicesData, title: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Descripción</Label>
                                <Textarea
                                    value={servicesData.subtitle || ''}
                                    onChange={(e) => setServicesData({ ...servicesData, subtitle: e.target.value })}
                                />
                            </div>
                            <Button onClick={() => handleSave('services', servicesData)} disabled={loading}>
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
                                    value={contactData.address || ''}
                                    onChange={(e) => setContactData({ ...contactData, address: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Teléfono</Label>
                                <Input
                                    value={contactData.phone || ''}
                                    onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Horario</Label>
                                <Input
                                    value={contactData.hours || ''}
                                    onChange={(e) => setContactData({ ...contactData, hours: e.target.value })}
                                />
                            </div>
                            <Button onClick={() => handleSave('contact', contactData)} disabled={loading}>
                                <Save className="w-4 h-4 mr-2" /> Guardar Contacto
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
