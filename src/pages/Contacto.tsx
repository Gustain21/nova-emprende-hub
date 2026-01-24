import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, Send, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Contacto = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success("¡Mensaje enviado!", {
      description: "Te responderemos lo antes posible.",
    });
    
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="brand-section brand-hero-gradient">
          <div className="brand-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-sm font-medium text-brand-orange mb-6">
                ¿Tienes preguntas?
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6">
                Ponte en{" "}
                <span className="brand-gradient-text">contacto</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Estamos aquí para ayudarte en tu camino emprendedor. Escríbenos y te responderemos lo antes posible.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="brand-section">
          <div className="brand-container">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="brand-card"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-orange to-brand-gold flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Envíanos un mensaje</h2>
                    <p className="text-sm text-muted-foreground">Te responderemos en 24-48h</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-foreground">
                        Nombre completo
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Tu nombre"
                        required
                        className="bg-muted border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-foreground">
                        Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="tu@email.com"
                        required
                        className="bg-muted border-border"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-foreground">
                      Asunto
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="¿Sobre qué quieres hablar?"
                      required
                      className="bg-muted border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-foreground">
                      Mensaje
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Cuéntanos cómo podemos ayudarte..."
                      rows={5}
                      required
                      className="bg-muted border-border resize-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    variant="hero" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Enviando..."
                    ) : (
                      <>
                        Enviar mensaje
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Información de contacto
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    ¿Tienes dudas sobre algún producto? ¿Necesitas ayuda con tu compra? 
                    ¿Quieres colaborar con nosotros? Estamos aquí para escucharte.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-dark-elevated flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-brand-orange" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Email</h3>
                      <a 
                        href="mailto:hola@editorialnovaemprende.com" 
                        className="text-muted-foreground hover:text-brand-orange transition-colors"
                      >
                        hola@editorialnovaemprende.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-dark-elevated flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-brand-sand" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Teléfono</h3>
                      <p className="text-muted-foreground">+34 600 000 000</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-dark-elevated flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-brand-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Ubicación</h3>
                      <p className="text-muted-foreground">España</p>
                    </div>
                  </div>
                </div>

                {/* FAQ Teaser */}
                <div className="brand-card bg-gradient-to-br from-brand-orange/10 to-brand-gold/5 border-brand-orange/30">
                  <h3 className="font-bold text-foreground mb-2">¿Preguntas frecuentes?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Consulta nuestras respuestas a las dudas más comunes sobre productos, pagos y acceso.
                  </p>
                  <Button variant="outline" size="sm">
                    Ver FAQ
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contacto;
